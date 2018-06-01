const { app, BrowserWindow, ipcMain, webContents } = require('electron');

const { port, GetPorts, OpenPort } = require('./serial');

let win;

/**
 * Create a GUI window and store its handle
 */
function CreateWindow() {
    win = new BrowserWindow({
        height: 800,
        width: 1000,
    });

    win.loadFile('index.html');

    win.on('closed', () => {
        win = null;
    });
}

/**
 * Quit the application when all windows are closed 
 * unless the user is on a Mac
 */
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
})

// Create a new window if there isn't one on Macs
app.on('activate', () => {
    if(win === null) {
        CreateWindow();
    }
})

app.on('ready', CreateWindow);

ipcMain.on('serial:getports', (event, arg) => {
    let devs = GetPorts();
    console.log(JSON.stringify(devs));
    event.returnValue(devs);
});