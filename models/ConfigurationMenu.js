const { BrowserWindow } = require('electron');

/**
 * Models the application configuration window
 */
class ConfigurationWindow {
    /**
     * Create a new configuration window
     * @constructor
     */
    constructor() {
        this.config = null;
        this.configGUI = `${__dirname}/../renderer-assets/html/config.html`;
    }

    /**
     * Create the configuration window or focus it if it exists
     * @param {object} handlers (optional) - Object that contains event 
     * handler names and functions.
     */
    openWindow(handlers) {
        if(!this.config) {
            this.config = new BrowserWindow({
                height: 500,
                width: 500,
                title: "Configuration Menu",
            });

            this.config.loadFile(this.configGUI);

            // this.config.setMenu(null);

            this.config.on('closed', () => this.config = null);

            if(handlers) {
                for(let key in handlers) {
                    this.config.on(key, handlers[key]);
                }
            }
        } else {
            this.config.focus();
        }
    }

    /**
     * Add an event handler to the configuration menu to 
     * run one time
     * @param {string} event - The event to add to
     * @param {function} callback - A callback function with 
     * no arguments 
     */
    addHandler(event, callback) {
        if(event !== 'closed') {
            this.config.addListener(event, callback);
            this.config.addListener(event, () => {
                this.config.removeListener(event, callback);
            })
        }
    }
}

exports.ConfigurationWindow = new ConfigurationWindow();