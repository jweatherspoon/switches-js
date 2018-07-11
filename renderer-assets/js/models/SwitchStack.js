/**
 * @file Models a stack of switches
 * @author Jonathan Weatherspoon
 */

const { ICX6450, ICX7150 } = require('./Switches');

const SWITCH_MAP = {
    ICX6450: ICX6450,
    ICX7150: ICX7150
}
 
/**
 * @class 
 * @classdesc Models a stack of switches 
 */
class SwitchStack {
    /**
     * Create a stack of switches   
     * @param {string} model - The model switch that is being stacked
     * @param {number} quantity - The number of switches in the stack
     */
    constructor(model, quantity) {
        let switchType = SWITCH_MAP[model];

        if(!switchType) {
            throw new Error(`Error: Switch model ${model} not supported`);
        }

        this._switches = [];
        for(let i = 0; i < quantity; i++) {
            this._switches.push(new switchType());
        }
    }

    /**
     * @type {Switch[]}
     */
    get switches() {
        return this._switches;
    }
}

module.exports = SwitchStack;