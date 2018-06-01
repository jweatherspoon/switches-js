const SerialPort = require('serialport');
const Parsers = SerialPort.parsers;

exports.parser = new Parsers.Readline({
    delimeter: '\n'
});

/**
 * Get a list of active serial ports. Each port contains a COM name and id
 * @returns {object[]} Active serial ports
 */
exports.GetPorts = async () => {
    var devices = [];
    await SerialPort.list((err, ports) => {
        ports.forEach(port => {
            if (port.pnpId) {
                console.log(port.pnpId);
                devices.push({
                    name: port.comName,
                    id: port.pnpId
                });
            }
        });
    });
    console.log(devices);
    return devices;
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