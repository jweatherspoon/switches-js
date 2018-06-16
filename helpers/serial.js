/**
 * @file Helper functions for dealing with serial communication
 * @author Jonathan Weatherspoon
 * @module serial
 */

const SerialPort = require('serialport');
const Ready = SerialPort.parsers.Ready;

/**
 * Get a list of active serial ports. Each port contains a COM name and id
 * @async
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
 * Create a new Ready Parser
 * @param {string} delimiter - The delimiter text for the
 * parser
 * @returns {ReadyParser} Serial parser that emits a ready
 * event when it matches text against the delimiter
 */
exports.ReadyParser = (delimiter) => {
    return new Ready({
        delimiter: delimiter
    });
}