/**
 * @file Models the browser that opens when a user needs 
 * to download switch code from a support site
 * @author Jonathan Weatherspoon
 */

const { BrowserWindow, Menu, dialog } = require('electron');
const { GenerateTemplate } = require('../helpers/menu-template');


/**
 * @class 
 * @classdesc Models the browser that opens when a user 
 * must download switch code from a support site. 
 */
class CodeVersionBrowser {
    /**
     * Create a new CodeVersionBrowser
     * @constructor 
     * @param {string} model - The switch model used for showing the instructions dialog
     * @param {string} version - The code version used for showing the instructions dialog
     */
    constructor(model, version) {
        this.browser = null;
        this.template = GenerateTemplate();
        this.template.push({
            label: 'Help',
            submenu: [
                {
                    label: "Show Instructions",
                    click: () => {
                        dialog.showMessageBox({
                            title: "Instructions for Downloading Code Version",
                            type: "info",
                            message: `
Download the code version ${version} archive for your switch and 
extract its contents to the Boot, Flash, and Firmware 
folders in the ${model}/${version} folder in your TFTP 
directory. Then, close out this window to continue the 
process.
                            `,
                            buttons: [
                                "OK",
                            ],
                        })
                    }
                }
            ]
        })
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

            this.browser.setMenu(
                Menu.buildFromTemplate(this.template)
            )

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

exports.CodeVersionBrowser = CodeVersionBrowser;