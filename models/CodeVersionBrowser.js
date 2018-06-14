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
            });

            this.browser.loadURL(url);

            this.browser.on('closed', () => this.browser = null);

            for(let key in handlers) {
                this.browser.on(key, handlers[key]);
            }
        } else {
            this.browser.focus();
        }
    }
}

exports.CodeVersionBrowser = new CodeVersionBrowser();