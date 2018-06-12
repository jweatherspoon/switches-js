const SerialPort = require('serialport');
const Parsers = SerialPort.parsers;

const { CodeVersionUrl } = require('../models/CodeVersionUrl');

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
