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
     */
    openWindow() {
        if(!this.config) {
            this.config = new BrowserWindow({
                height: 500,
                width: 500,
                title: "Configuration Menu",
            });

            this.config.loadFile(this.configGUI);

            // this.config.setMenu(null);

            this.config.on('close', () => this.config = null);
        } else {
            this.config.focus();
        }
    }
}

exports.ConfigurationWindow = ConfigurationWindow;