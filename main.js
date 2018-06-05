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
 * Quit the application when all windows are closed unless the user is on a Mac
 */
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
})

/**
 * Re-create the window if the user is on a Mac
 */
app.on('activate', () => {
    if(win === null) {
        CreateWindow();
    }
})

app.on('ready', CreateWindow);


// EVENTS 

ipcMain.on('serial:getports', (event, arg) => {
    GetPorts().then(data => {
        event.sender.send('serial:getports:reply', data);
    })
});

ipcMain.on('loadpage',(event, arg) => {
    win.loadFile(arg);
    console.log(arg);
}) 