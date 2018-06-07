const { BrowserWindow } = require('electron');

class ConfigurationWindow {
    constructor() {
        this.config = null;
        this.configGUI = `${__dirname}/../renderer-assets/html/config.html`;
    }

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