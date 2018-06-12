const SerialPort = require('serialport');
const Parsers = SerialPort.parsers;
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const { CodeVersionUrl } = require('../CodeVersionUrl');

const {
    GetTFTPDirectoryContents    
} = require('./filesys');

exports.URLS = {
    ruckus: new CodeVersionUrl('https://support.ruckuswireless.com', 'product_families/21-ruckus-icx-switches'),
};

exports.parser = new Parsers.Readline({
    delimeter: '\n'
});

/**
 * Get a list of active serial ports. Each port contains a COM name and id
 * @returns {object[]} Active serial ports
 */
exports.GetPorts = async () => {
    let ports = await SerialPort.list();
    ports = ports.filter(port => port.pnpId);
    return ports;
};

/**
 * Open a serial connection given a port and baudrate
 * @param {string} portname - The COM port of the serial device
 * @param {number} baudRate - The baud rate used to communicate with the device
 * @returns {SerialPort} Connection to the specified serial device
 */
exports.OpenPort = (portname, baudRate) => {
    return new SerialPort(portname, {
        baudRate: baudRate
    });
};

/**
 * Get the recommended firmware version for a switch 
 * @param {string} model - The model name of the switch 
 * @param {string} url - The url to search
 * @returns {object} - An object containing the recommended
 * code version and a link to the file 
 */
exports.GetRecommendedCodeVersion = async (model, url) => {
    // let html = await fetch(url).then(resp => resp.text());
    // let $ = cheerio.load(html);

    let $ = await FetchHtmlAndLoad(url);

    // Search for the model name 
    let link = FindElementsByText($, 'a', model);

    console.log("First Link:", link.length);
    
    // Make sure a link was retrieved. If not return null
    if(link.length < 1) return null;
    // Get the href from the parsed element
    link = link[0].attribs.href;


    // Follow the parsed link and fetch the HTML
    $ = await FetchHtmlAndLoad(link);
    link = FindElementsByText($, 'dt', 'Recommended Firmware:');

    // Make sure a link was retrieved 
    if(link.length < 1) return null;

    // try to get the link to the firmware version
    try {
        let href = link[0].next.next.firstChild.attribs.href;
        
        console.log("Second link:", JSON.stringify(href));

        // Now that we have the link, find the code version
        let re = /\d+-\d+-\d+\w*/;
        let ver = re.exec(href);

        let data = {
            href: href,
        };

        if(ver) { // Code version successfully found
            data.version = ver[0].replace(/\.|-/g, '');
        }

        return data;
    } catch (ex) {
        return null; // Could not get the firmware version
    }
}

/**
 * Check the machine's TFTP directory for a code version 
 * @param {string} ver - The code version to check for
 * @throws {Error} If there is no configured TFTP directory
 * @returns {boolean} True if the version is found in the folder
 */
exports.CheckTFTPDirForCodeVersion = async (ver, files) => {
    let re = /\.|-/g;
    let found = false;
    for(let file of files) {
        file = file.replace(re, ''); // Remove dashes and dots
        if(file.includes(ver)) {
            found = true;
            break;
        }
    }

    return found;
}

/**
 * Fetch some html and load it into the cheerio parser
 * @param {string} url - The URL to fetch HTML from 
 * @returns {Cheerio} A cheerio parser with the HTML loaded
 */
FetchHtmlAndLoad = async (url) => {
    let html = await fetch(url).then(resp => resp.text());
    return cheerio.load(html);
}

/**
 * Use cheerio to find HTML tags given their inner text
 * @param {Cheerio} $ - A cheerio parser with the HTML loaded
 * @param {string} tag - The type of tag to search for 
 * @param {string} text - The inner text to match against
 * @returns {string[]} A list of elements that matched the 
 * given parameters
 */
FindElementsByText = ($, tag, text) => {
    let elements = $(tag).filter(function(index) {
        if($(this).text() === text) {
            return text;
        }
    });

    return elements;
}
