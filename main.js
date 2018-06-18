/**
 * @file Main process for the application
 * @author Jonathan Weatherspoon
 * @author Noah Rotroff
 */

const {
    app,
    BrowserWindow,
    ipcMain,
    webContents,
    Menu,
} = require('electron');

const {
    port,
    GetPorts,
    OpenPort,
    GetRecommendedCodeVersion,
    CheckTFTPDirForCodeVersion,
    URLS,
} = require('./helpers/serial');
const { GenerateTemplate } = require('./helpers/menu-template');
const { ConfigurationWindow } = require('./models/ConfigurationMenu');
const { WipingModeWindow } = require('./models/WipingModeWindow');

const path = require('path');

let win, config, browser;

let switchConfigSettings = {

};

/**
 * Create a GUI window and store its handle
 * @returns {BrowserWindow} A handle to the created window
 */
function CreateWindow(href) {
    let win = new BrowserWindow({
        height: 800,
        width: 1000,
        title: "Switch Configuration",
        icon: path.join(__dirname, 'renderer-assets/icons/png/icon.png')
    });

    if (!href) {
        win.loadFile("./renderer-assets/html/index.html");
    } else {
        win.loadURL(href);
    }

    return win
}

/**
 * Quit the application when all windows are closed unless the user is on a Mac
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

/**
 * Re-create the window if the user is on a Mac
 */
app.on('activate', () => {
    if (win === null) {
        CreateWindow();
    }
})

/**
 * Create the main window, set its event handlers, and 
 * build out the application menu
 */
app.on('ready', () => {
    win = CreateWindow();

    win.on('closed', () => {
        win = null;
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    let template = GenerateTemplate(ConfigurationWindow, WipingModeWindow);
    Menu.setApplicationMenu(
        Menu.buildFromTemplate(template)
    );
});

// EVENTS 

/**
 * Get a list of active serial ports and return them to the 
 * sender.
 */
ipcMain.on('serial:getports', (event, arg) => {
    GetPorts().then(data => {
        event.sender.send('serial:getports:reply', data);
    })
});

/**
 * Show the configuration menu
 */
ipcMain.on("configmenu:show", (event, arg) => {
    ConfigurationWindow.openWindow();
});

// Add to switchConfigSettings object here

/**
 * Set a property of the switchConfigSettings object
 */
ipcMain.on('switchConfig:set', (event, arg) => {
    switchConfigSettings[arg.page] = arg.data;
});

/**
 * Get a property of the switchConfigSettings object
 */
ipcMain.on('switchConfig:get', (event, page) => {
    event.sender.send('config:get:return', switchConfigSettings[page])
});