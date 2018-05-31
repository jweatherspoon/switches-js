const { app, BrowserWindow, ipcMain } = require('electron');

let win;

// Create a GUI window for the application
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

// Quit app when all windows are closed unless on a Mac
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