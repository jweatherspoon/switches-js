const { BrowserWindow } = require('electron');
const path = require('path');

class CodeVersionBrowser {
    constructor() {
        this.browser = null;
    }

    openWindow(url, handlers) {
        if(!this.browser) {
            this.browser = new BrowserWindow({
                height: 800,
                width: 1000,
                title: "Switch Configuration",
                icon: path.join(__dirname, '../renderer-assets/icons/png/icon.png'), 
            }) 

            this.browser.loadURL(url);

            this.browser.on('close', () => this.browser = null);

            for(let key in handlers) {
                this.browser.on(key, handlers[key]);
            }
        }
    }
}

exports.CodeVersionBrowser = new CodeVersionBrowser();