/**
 * @file Models the window for wiping Brocade switches
 * @author Jonathan Weatherspoon
 */

const { BrowserWindow } = require('electron');

/**
 * @class 
 * @classdesc Models the GUI for wiping switches
 */
class WipingModeWindow {
    /**
     * Create a new Wiping Window 
     * @constructor
     */
    constructor() {
        this.window = null;
        this.windowGUI = `${__dirname}/../renderer-assets/html/wipe.html`;
    }

    /**
     * Open or focus the wiping window
     */
    openWindow() {
        if(!this.window) {
            this.window = new BrowserWindow({
                height: 600,
                width: 600,
                title: "Switch Wiping Menu",
            });

            this.window.loadFile(this.windowGUI);

            this.window.on('closed', () => {
                this.window = null;
            })
        } else {
            this.window.focus();
        }
    }
}

exports.WipingModeWindow = new WipingModeWindow();