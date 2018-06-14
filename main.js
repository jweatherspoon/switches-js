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
const { GetTFTPDirectoryContents } = require('./helpers/filesys');
const { GenerateTemplate } = require('./models/MenuTemplate');
const { ConfigurationWindow } = require('./models/ConfigurationMenu');

const path = require('path');

let win, config, browser;

let switchConfigSettings = {

};

/**
 * Create a GUI window and store its handle
 */
function CreateWindow(href) {
    let win = new BrowserWindow({
        height: 800,
        width: 1000,
        title: "Switch Configuration",
        icon: path.join(__dirname, 'renderer-assets/icons/png/icon.png')
    });

    if(!href) {
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

app.on('ready', () => {
    win = CreateWindow();

    win.on('closed', () => {
        win = null;
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    let template = GenerateTemplate(ConfigurationWindow);
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

ipcMain.on('filesys:checkver', (event, arg) => {
    GetRecommendedCodeVersion(arg.model, URLS[arg.site].url).then(data => {
        console.log(data);
        if(data) {
            let url = `${URLS[arg.site].base}${data.href}`;
            GetTFTPDirectoryContents(data.version, (ver, files) => {
                CheckTFTPDirForCodeVersion(ver, files).then(found => {
                    console.log(found);
                    if(!found) {
                        console.log(url);
                        browser = CreateWindow(url);
                        browser.webContents.executeJavaScript(
                            'alert("The recommended code version for this switch was not found on your system. Please download it from this page and extract it to your configured TFTP directory.");'
                        )
                    }
                });
            });
        }
    })
})

// Add to switchConfigSettings object here
 ipcMain.on('switchConfig:set', (event, arg) => {
     switchConfigSettings[arg.page] = arg.data;
 });

 ipcMain.on('switchConfig:get', (event, page) => {
    event.sender.send('config:get:return', switchConfigSettings[page])
 });