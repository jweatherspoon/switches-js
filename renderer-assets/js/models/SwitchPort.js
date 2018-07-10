/**
 * @file Contains model of a switch port
 * @author Jonathan Weatherspoon
 */

/**
 * @class 
 * @classdesc Models a port on a switch in a stack unit
 */
class SwitchPort {
    /**
     * Create a port model
     * @constructor
     * @param {number} portID - The ID of the port
     */
    constructor(portID) {
        this._id = portID;
    }

    /**
     * @type {number}
     */
    get id() {
        return this._id;
    }

    /**
     * @type {number}
     */
    set id(newID) {
        if(newID < 0) newID = 0;
        else if(newID > 48) newID = 48;
        this._id = newID;
    }
    
}

module.exports = SwitchPort;