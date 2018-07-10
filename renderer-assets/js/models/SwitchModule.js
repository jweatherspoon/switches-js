/**
 * @file Models a port module on a switch
 * @author Jonathan Weatherspoon
 */

 const SwitchPort = require('./SwitchPort');

/**
 * @class 
 * @classdesc Models a port module on a switch
 */
class SwitchModule {
    /**
     * 
     * @param {number} numPorts - The number of ports in the module
     * @param {string} GUI - Relative path to the page this module
     * is related to
     * @param {boolean} isBrocade - Should be set to true if the related
     * switch is a brocade / ruckus model to correctly set the port
     * ID numbers (default: false)
     */
    constructor(numPorts, GUI, isBrocade=false) {
        this._gui = GUI;

        this._ports = [];
        for(let i = 0; i < numPorts; i++) {
            let id = i;
            if(isBrocade) id++;

            this._ports.push(new SwitchPort(id));
        }

        this._configured = false;
    }

    /**
     * @type {boolean}
     */
    get configured() {
        return this._configured;
    }

    /**
     * @type {boolean}
     */
    set configured(newStatus) {
        this._configured = status;
    }

    /**
     * @type {string}
     */
    get GUI() {
        return this._gui;
    }

    /**
     * @type {SwitchPort[]}
     */
    get ports() {
        return this._ports;
    }
}

module.exports = SwitchModule;