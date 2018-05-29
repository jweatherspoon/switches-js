const { app, BrowserWindow } = require('electron');

let win;

function CreateWindow() {
    win = new BrowserWindow({
        height: 800,
        width: 1000,
    });

    win.loadFile('index.html');

}

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('ready', CreateWindow);