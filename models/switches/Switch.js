/**
 * @file Models a generic switch with serial communication 
 * capability.
 * @author Jonathan Weatherspoon
 */

const SerialPort = require('serialport');
const Ready = SerialPort.parsers.Ready;

/**
 * @class 
 * @classdesc Models a generic switch that has serial 
 * communication capability.
 */
class Switch {
    /**
     * Create a generic switch object
     * @param {string} portName - The name of the serial port 
     * to connect to
     * @param {number} baudRate - The desired baud rate
     */
    constructor(portName, baudRate) {
        this.portName = portName;
        this.baud = baudRate;
        this.parser = null;
        
        // Connect to the switch
        this.port = new SerialPort(this.portName, {
            baudRate: this.baud
        })
    }

    /**
     * Write a command to a switch over serial      
     * @param {string} command - The command to send to the 
     * switch
     */
    write(command) {
        this.port.write(command);
    }

    /**
     * Add a listener for some serial output from the switch
     * @param {string} eventText - The text that will fire the event
     * @param {any} resolveValue - The value that the returned
     * Promise will resolve to 
     * @returns {Promise<any>} Resolves when the event text 
     * is read from the switch
     */
    async addListener(eventText, resolveValue) {
        return new Promise((resolve, reject) => {
            this.parser = this.port.pipe(new Ready({
                delimiter: eventText,
            }));

            this.parser.on('ready', () => {
                resolve(resolveValue)
            });
        });
    }
}

exports.Switch = Switch;