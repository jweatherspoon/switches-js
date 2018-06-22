/**
 * @file Model for Brocade / Ruckus switch operations
 * @author Jonathan Weatherspoon
 */

const path = require('path');
const storage = require('electron-json-storage');

const { 
    settingKeys,
    GetTFTPSettings,
} = require('../../helpers/user-settings');
const { CheckCodeExists } = require('../../helpers/code-version');

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
     * @param {string} model - The model switch this is
     * @param {function} logger - Callback function for 
     * logging received serial data
     */
    constructor(portName, baudRate, model, logger) {
        super(portName, baudRate, logger);
        this.model = model;
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
        await this.write(`copy tftp ${target} ${serverIP} ${filename}`);
        await this.addListener(">");
    }

    /**
     * Copy the primary flash to the secondary flash location
     */
    async copyFlashToSec() {
        await this.write("copy flash flash sec");
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

    /**
     * Upload the default 
     * @param {string} codeVer - The version of code for uploading
     * @param {string} template - Relative path to the startup template
     * from the user's tftp directory
     */
    async uploadDefaults(codeVer, template) {
        // Get TFTP settings
        let tftp = await GetTFTPSettings();


        // Get code version filenames 
        let codes = await CheckCodeExists(tftp.dir, this.model, codeVer);

        // TFTP Boot, Flash, Startup template
        await this.tftp("boot", tftp.serverIP, codes.boot);
        await this.tftp("flash", tftp.serverIP, codes.flash);
        await this.copyFlashToSec();
        await this.tftp("startup-config", tftp.serverIP, template);

        // TFTP PoE Firmware if applicable
        if(codes.poe) {
            await this.inlinePower(tftp.serverIP, codes.poe);
        }

    }
}

exports.Brocade = Brocade;
exports.Ruckus = Brocade;