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
    GetPorts,
} = require('./helpers/serial');
const { GenerateTemplate } = require('./helpers/menu-template');

const { ConfigurationWindow } = require('./models/ConfigurationMenu');
const { WipingModeWindow } = require('./models/WipingModeWindow');

const { Brocade } = require('./models/switches/Brocade');

const path = require('path');

let win;

let switchConfigSettings = {

};

let switchObject;

/**
 * Create a GUI window and store its handle
 * @param {string} href - The URL to open. Defaults to index.html if null.
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

/**
 * Connect to a switch given some arguments
 */
ipcMain.on("serial:connect", (event, arg) => {
    if(switchObject) {
        switchObject.disconnect();
        switchObject = null;
    }
    try {
        switchObject = new Brocade(arg.portName, arg.baudRate, arg.model, console.log);
        event.sender.send("serial:connected", true);
    } catch(err) {
        event.sender.send("serial:connected", false);
    }
});

/**
 * Disconnect from a switch
 */
ipcMain.on("serial:disconnect", (event, arg) => {
    if(switchObject) {
        switchObject.disconnect();
        switchObject = null;
    }
})

/**
 * Upload default configuration and updated code versions (including
 * PoE firmware if applicable). Also enable stacking on the device 
 * with a supplied priority value.
 */
ipcMain.on("stack:begin", async (event, arg) => {
    let returnValue = {
        id: arg.id,
        success: true,
    }
    if(switchObject) {
        try {
            event.sender.send("stack:ready", arg.id);
            // Handle the boot process
            await switchObject.handleBoot();
            // Send off an event to allow the progress bar to 
            // begin moving and continue on the process 
            event.sender.send("stack:response", returnValue);

            let ip = "192.168.1.1";

            await switchObject.setIP(ip, "255.255.255.0");
            await switchObject.uploadDefaults(arg.codeVer, arg.template);
            await switchObject.unsetIP(ip);

            if(arg.switchCount > 1) {
                await switchObject.enableStacking(arg.priority);
                await switchObject.commit();
            }

            // Fire off the "finished" event
            event.sender.send("stack:fin", returnValue);
        } catch(err) {
            returnValue.success = false;
            returnValue.error = err;
            event.sender.send("stack:response", returnValue);
        }
    } else {
        returnValue.success = false;
        event.sender.send("stack:response", returnValue);
    }
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

ipcMain.on('tftp:get', e => {
    GetTFTPSettings().then(data => {
        e.sender.send("tftp:send", data);
    })
})

// ONLY FOR TESTING REMOVE IN PRODUCTION BUILD
ipcMain.on("command", (event, cmd, ...args) => {
    if(switchObject) {
        switchObject[cmd](...args);
    }
})