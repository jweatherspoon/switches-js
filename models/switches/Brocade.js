// /**
//  * @file Model for Brocade / Ruckus switch operations
//  * @author Jonathan Weatherspoon
//  */

// const { Switch } = require('./Switch');

// /**
//  * @class 
//  * @classdesc Models Brocade / Ruckus switch interactions and 
//  * allows the user to perform useful operations on such 
//  * switches over a serial communication.
//  */
// class Brocade {
//     /**
//      * Create a new Brocade / Ruckus switch object  
//      * @param {string} portName - The name of the serial port 
//      * to connect to
//      * @param {number} baudRate - The desired baud rate
//      */
//     constructor(portName, baudRate) {
//         this.switch = new Switch(portName, baudRate);
//     }

//     /**
//      * Handle the boot sequence for a Brocade / Ruckus switch
//      * @returns {boolean} Resolves when the switch has booted
//      */
//     async handleBoot() {
//         // Enter the boot monitor 
//         await this.switch.addListener("Enter 'b' to stop at boot monitor");
//         // bypass the password and begin booting
//         await this.passwordBypass();
//         // Wait for the system to finish booting 
//         await this.switch.addListener("supply 1 detected");
//         return true;
//     }

//     /**
//      * Reset a Brocade switch to factory default
//      */
//     async wipe() {
//         await this.handleBoot();

//         await this.enable();

//         await this.switch.write("stack unconfigure me");
//         await this.switch.write("y", false);

//         await this.switch.write("erase start");
//         await this.switch.write("reload");
//         await this.switch.write('y', false);
//         await this.switch.write('y', false);
//     }

//     /**
//      * Bypass the Brocade / Ruckus enable password and boot
//      */
//     async passwordBypass() {
//         await this.switch.write('b', false);
//         await this.switch.addListener('>');
//         await this.switch.enter(2);
//         await this.switch.wait(1000);
//         await this.switch.write("no password");
//         await this.switch.wait(1000);
//         // Try to boot using the old method first
//         await this.switch.write("boot system flash primary");
//         await this.switch.wait(1000);
//         await this.switch.write("boot");
//         await this.switch.wait(1000);

//         return true;
//     }

//     /**
//      * Give a switch a management IP        
//      * @param {string} ip - The IP to give to the switch
//      * @param {string} netmask - The subnet mask to give to the switch
//      */
//     async setIP(ip, netmask) {
//         await this.enable();
//         await this.switch.write("configure terminal");
//         await this.switch.write("interface management 1");
//         await this.switch.write(`ip add ${ip} ${netmask}`);
//         await this.switch.write("quit");

//         return true;
//     }

//     /**
//      * Copy a file from a TFTP server and store it on the switch
//      * @param {string} target - The target location for the file
//      * @param {string} serverIP - The IP of the TFTP server
//      * @param {string} filename - The name of the file that will 
//      * be copied from the TFTP server
//      */
//     async tftp(target, serverIP, filename) {

//     }

//     /**
//      * Copy the primary flash to the secondary flash location
//      */
//     async copyFlashToSec() {

//     }

//     /**
//      * Enter the brocade configuration terminal
//      * @returns {boolean} Resolves to true once completed.
//      */
//     async enterConfigureTerminal() {
//         await this.enable();
//         await this.switch.write("configure terminal");
//         await this.switch.addListener("#");

//         return true;
//     }

//     /**
//      * Enter enable mode
//      */
//     async enable() {
//         await this.switch.write("enable");
//     }

// }

// exports.Brocade = Brocade;
// exports.Ruckus = Brocade;

/**
 * @file Model for Brocade / Ruckus switch operations
 * @author Jonathan Weatherspoon
 */

const { Switch } = require('./Switch');

/**
 * @class 
 * @classdesc Models Brocade / Ruckus switch interactions and 
 * allows the user to perform useful operations on such 
 * switches over a serial communication.
 */
class Brocade extends Switch {
    /**
     * Create a new Brocade / Ruckus switch object  
     * @param {string} portName - The name of the serial port 
     * to connect to
     * @param {number} baudRate - The desired baud rate
     */
    constructor(portName, baudRate, logger) {
        super(portName, baudRate, logger);
    }

    /**
     * Handle the boot sequence for a Brocade / Ruckus switch
     * @returns {boolean} Resolves when the switch has booted
     */
    async handleBoot() {
        // Enter the boot monitor 
        await this.addListener("Enter 'b' to stop at boot monitor");
        // bypass the password and begin booting
        await this.passwordBypass();
        // Wait for the system to finish booting 
        await this.addListener("supply 1 detected");
        return true;
    }

    /**
     * Reset a Brocade switch to factory default
     */
    async wipe() {
        await this.handleBoot();

        await this.enable();

        await this.write("stack unconfigure me");
        await this.write("y", false);

        await this.write("erase start");
        await this.write("reload");
        await this.write('y', false);
        await this.write('y', false);
    }

    /**
     * Bypass the Brocade / Ruckus enable password and boot
     */
    async passwordBypass() {
        await this.write('b', false);
        await this.addListener('>');
        await this.enter(2);
        await this.wait(1000);
        await this.write("no password");
        await this.wait(1000);
        // Try to boot using the old method first
        await this.write("boot system flash primary");
        await this.wait(1000);
        await this.write("boot");
        await this.wait(1000);

        return true;
    }

    /**
     * Give a switch a management IP        
     * @param {string} ip - The IP to give to the switch
     * @param {string} netmask - The subnet mask to give to the switch
     */
    async setIP(ip, netmask) {
        await this.enable();
        await this.write("configure terminal");
        await this.write("interface management 1");
        await this.write(`ip add ${ip} ${netmask}`);
        await this.write("quit");

        return true;
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

    /**
     * Enter the brocade configuration terminal
     * @returns {boolean} Resolves to true once completed.
     */
    async enterConfigureTerminal() {
        await this.enable();
        await this.write("configure terminal");
        await this.addListener("#");

        return true;
    }

    /**
     * Enter enable mode
     */
    async enable() {
        await this.write("enable");
    }

}

exports.Brocade = Brocade;
exports.Ruckus = Brocade;