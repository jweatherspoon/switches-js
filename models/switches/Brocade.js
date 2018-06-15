/**
 * @file Model for Brocade / Ruckus switch operations
 * @author Jonathan Weatherspoon
 */

const Switch = require('./Switch');

/**
 * @class 
 * @classdesc Models Brocade / Ruckus switch interactions and 
 * allows the user to perform useful operations on such 
 * switches over a serial communication.
 */
class Brocade {
    /**
     * Create a new Brocade / Ruckus switch object  
     * @param {string} portName - The name of the serial port 
     * to connect to
     * @param {number} baudRate - The desired baud rate
     */
    constructor(portName, baudRate) {
        this.switch = new Switch(portName, baudRate);
    }

    /**
     * Reset a Brocade switch to factory default
     */
    async wipe() {

    }

    /**
     * Bypass the Brocade / Ruckus enable password and boot
     */
    async passwordBypass() {

    }

    /**
     * Give a switch a management IP        
     * @param {string} ip - The IP to give to the switch
     */
    async setIP(ip) {

    }

    /**
     * Copy a file from a TFTP server and store it on the switch
     * @param {string} target - The target location for the file
     * @param {string} serverIP - The IP of the TFTP server
     * @param {string} filename - The name of the file that will 
     * be copied from the TFTP server
     */
    async tftp(target, serverIP, filename) {

    }

    /**
     * Copy the primary flash to the secondary flash location
     */
    async copyFlashToSec() {

    }


}

exports.Brocade = Brocade;
exports.Ruckus = Brocade;