const { 
    app, 
    BrowserWindow, 
    ipcMain, 
    webContents, 
    Menu,
} = require('electron');

const path = require('path');

const { port, GetPorts, OpenPort } = require('./models/helpers/serial');

const { template } = require('./models/MenuTemplate');

let win, config;

/**
 * Create a GUI window and store its handle
 */
function CreateWindow() {
    win = new BrowserWindow({
        height: 800,
        width: 1000,
        title: "Switch Configuration",
        icon: path.join(__dirname, 'renderer-assets/icons/png/icon.png')
    });

    win.loadFile('./renderer-assets/html/index.html');

    win.on('closed', () => {
        win = null;
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
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

app.on('ready', () => {
    CreateWindow();
    Menu.setApplicationMenu(
        Menu.buildFromTemplate(template)
    );
});


// EVENTS 

ipcMain.on('serial:getports', (event, arg) => {
    GetPorts().then(data => {
        event.sender.send('serial:getports:reply', data);
    })
});