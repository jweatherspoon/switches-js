/**
 * @file Models the browser that opens when a user needs 
 * to download switch code from a support site
 * @author Jonathan Weatherspoon
 */

const { BrowserWindow } = require('electron');
const path = require('path');


/**
 * @class 
 * @classdesc Models the browser that opens when a user 
 * must download switch code from a support site. 
 */
class CodeVersionBrowser {
    /**
     * Create a new CodeVersionBrowser
     * @constructor 
     */
    constructor() {
        this.browser = null;
    }

    /**
     * Open a browser to a support site for the user
     * @param {string} url - The URL to load on browser open
     * @param {object} handlers - An object where the keys 
     * contain event names and the values are callback 
     * functions to be executed.
     */
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