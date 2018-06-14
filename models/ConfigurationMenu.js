const { BrowserWindow, Menu, dialog } = require('electron');
const storage = require('electron-json-storage');
const { GenerateTemplate } = require('./MenuTemplate');

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
    
        this.menuTemplate = GenerateTemplate(this);
        this.menuTemplate.push({
            label: "Clear Settings",
            submenu: [
                {
                    label: "Clear All Settings",
                    click: () => {
                        this.clearSettingsProcess();
                    }
                }
            ]
        });
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

            this.config.setMenu(
                Menu.buildFromTemplate(this.menuTemplate)
            );

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

    clearSettingsProcess() {
        let buttons = [
            "I DONT NEED NO SETTINGS",
            "Get me outta here!!!",
        ];
        dialog.showMessageBox({
            title: "Are You Sure?",
            message: `
            This will clear ALL user settings and 
            show you the configuration menu on your next 
            startup. This action is IRREVERSIBLE. 
            Are you sure you want to do this?
        `,
            buttons: buttons,
            type: "warning",
        }, (index) => {
            if (index === 0) {
                storage.clear();
                this.config.close();
            }
        })
    }
}

exports.ConfigurationWindow = new ConfigurationWindow();