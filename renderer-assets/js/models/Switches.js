/**
 * @file Models an ICX6450 switch
 * @author Jonathan Weatherspoon
 */

const SwitchModule = require('./SwitchModule')

const ModuleGUIs = {
    copper: "PortPickerTheJonWay.html",
    sfp: "SFPModule.html"
}

class Switch {
    constructor() {
        this._modules = [];
    }

    /**
     * @type {SwitchModule[]}
     */
    get modules() {
        return this._modules;
    }
}

/**
 * @class 
 * @classdesc Models an ICX6450 switch
 */
class ICX6450 extends Switch {
    /**
     * Create a model of an ICX6450
     * @constructor 
     */
    constructor() {
        super();
        this._modules = [
            new SwitchModule(48, ModuleGUIs.copper, true),
            new SwitchModule(4, ModuleGUIs.sfp, true)
        ]
    }
}

/**
 * @class 
 * @classdesc Models an ICX7150 switch
 */
class ICX7150 extends Switch {
    /**
     * Create a model of an ICX7150
     * @constructor
     */
    constructor() {
        super();
        
    }
}

module.exports = {
    ICX6450: ICX6450,
    ICX7150: ICX7150
}