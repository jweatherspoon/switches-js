/**
 * @file Model for Brocade / Ruckus switch operations
 * @author Jonathan Weatherspoon
 */

const path = require('path');

const { 
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
        await this.addListener("Switch>");
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
        await this.enterConfigureTerminal();
        await this.write("interface management 1");
        await this.write(`ip add ${ip} ${netmask}`);
        await this.write("quit");

        return true;
    }

    /**
     * Unset the IP given to the switch
     * @param {string} ip - The current ip address of the switch
     */
    async unsetIP(ip) {
        await this.enterConfigureTerminal();
        await this.write(`no ip address ${ip}`);
        await this.write('ip dhcp-client enable');
        await this.write('quit');
    }

    /**
     * Copy a file from a TFTP server and store it on the switch
     * @param {string} target - The target location for the file
     * @param {string} serverIP - The IP of the TFTP server
     * @param {string} filename - The name of the file that will 
     * be copied from the TFTP server. This must be a relative path 
     * from the root of the user's TFTP directory
     * @param {string} version - The code version used to generate the 
     * relative path to the filename
     * @param {string} flashTarget - (optional) The target for copying flash 
     * code. Can be primary, secondary, or bootrom.
     */
    async tftp(target, serverIP, filename, version, flashTarget = '') {
        let relativePath = filename;

        // Set the filename to a relative path if the template isn't being used
        if(version) {
            relativePath = path.join("/", this.model, version, filename);
        }

        await this.write(`copy tftp ${target} ${serverIP} "${relativePath}" ${flashTarget}`);
        await this.addListener("TFTP");
    }

    /**
     * Copy the primary flash to the secondary flash location
     */
    async copyFlashToSec() {
        await this.write("copy flash flash sec");
        await this.addListener("Done");
    }

    /**
     * Enter the brocade configuration terminal
     * @returns {boolean} Resolves to true once completed.
     */
    async enterConfigureTerminal() {
        await this.write('quit');
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
        try {
            let tftp = await GetTFTPSettings();
            // Get code version filenames 
            let codes = await CheckCodeExists(tftp.directory, this.model, codeVer);
            
            // TFTP Boot, Flash, Startup template
            await this.enable();
            await this.tftp("startup-config", tftp.serverIP, template);
            await this.tftp("flash", tftp.serverIP, `Boot/${codes.boot}`, codeVer, "bootrom");
            await this.tftp("flash", tftp.serverIP, `Flash/${codes.flash}`, codeVer, "primary");
            await this.copyFlashToSec();
    
            // TFTP PoE Firmware if applicable
            if(codes.poe) {
                await this.inlinePower(tftp.serverIP, codeVer, codes.poe);
            }
        } catch(err) {
            console.log(err);
        }
    }

    /**
     * Install PoE firmware on the machine
     * @param {string} serverIP - The IP of the TFTP server
     * @param {string} codeVer - The code version of the upload
     * @param {string} poeFilename - The filename for the POE firmware 
     * relative to the user's configured TFTP directory
     */
    async inlinePower(serverIP, codeVer, poeFilename) {
        let relativePath = path.join('/', this.model, codeVer, "Firmware", poeFilename);
        await this.write(`inline power install-firmware all tftp ${serverIP} ${relativePath}`);
        await this.addListener("100 percent complete");
    }

    /**
     * Enable stacking on a switch
     * @param {number} priority - The priority for the switch in 
     * the stack. (Acceptable values: 0 - 255)
     */
    async enableStacking(priority) {
        if(priority < 0) priority = 0;
        else if(priority > 255) priority = 255;

        await this.enterConfigureTerminal();
        await this.write("stack enable");
        await this.write(`stack unit 1`);
        await this.write(`priority ${priority}`);
        await this.write('exit');
        await this.write('hitless-failover enable');
    }

    /**
     * Add the motd banner to a switch without committing it
     * to the startup configuration
     */
    async addBanner() {
        let bannerText = "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////\n\n\n\nThis system is for the use of authorized users only.\n\n\n\n\n\nIndividuals using this computer system without authority, or in excess of their authority, are subject to having all of their activities on this system monitored and recorded by system personnel.In the course f monitoring individuals improperly using this system, or in the course of system maintenance, the activities of authorized users may also be monitored.Anyone using this system expressly consents to such monitoring and is advised that f such monitoring reveals possible criminal activity, system personnel may provide the evidence of such monitoring to law enforcement officials.See UNR Security Awareness and Acceptable Use Policy for full terms of use.\n\n\n\n\n\n/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////";
        await this.write('quit');
        await this.enterConfigureTerminal();
        await this.wait(500);
        await this.write("banner motd ^");
        await this.wait(500);
        await this.write(bannerText);
        await this.wait(2000);
        await this.write("^");
        await this.wait(500);
    }

    /**
     * Save your changes to the startup configuration
     */
    async commit() {
        await this.write('quit');
        await this.enterConfigureTerminal();
        await this.write("write memory");
    }
}

exports.Brocade = Brocade;
exports.Ruckus = Brocade;