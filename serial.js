const SerialPort = require('serialport');
const Parsers = SerialPort.parsers;
const cheerio = require('cheerio');

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
}

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
}

/**
 * Get the recommended firmware version for a switch 
 * @param {string} model - The model name of the switch 
 * @param {string} url - The url to search
 * @returns {object} - An object containing the recommended
 * code version and a link to the file 
 */
exports.GetRecommendedCodeVersion = async (model, url) => {
    let html = await fetch(url).then(resp => resp.text());
    let $ = cheerio.load(html);

    // Search for the model name 
    let link = $('a').filter(i => this.text === model);

    return link;
}