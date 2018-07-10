/**
 * @file Models an ICX6450 switch
 * @author Jonathan Weatherspoon
 */

const SwitchModule = require('./SwitchModule')

/**
 * @class 
 * @classdesc Models an ICX6450 switch
 */
class ICX6450 {
    /**
     * Create a model of an ICX6450
     * @constructor 
     */
    constructor() {
        this._modules = [
            new SwitchModule(48, 'PortPickerTheJonWay.html', true),
            new SwitchModule(4, 'SFPModule.html', true)
        ]
    }

    /**
     * @type {SwitchModule[]}
     */
    get modules() {
        return this._modules;
    }

}

module.exports = ICX6450;