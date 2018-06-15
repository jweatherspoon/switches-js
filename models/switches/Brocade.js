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
     * Handle the boot sequence for a Brocade / Ruckus switch
     * @returns {boolean} Resolves when the switch has booted
     */
    async handleBoot() {
        // Enter the boot monitor 
        await this.switch.addListener("press b to stop");

        // bypass the password and begin booting
        await this.passwordBypass();

        // Wait for the system to finish booting 
        await this.switch.addListener("Initialization is done");

        return true;
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
        await this.switch.write("no password");
        // Try to boot using the old method first
        await this.switch.write("boot system flash primary");
        await this.switch.write("boot");
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