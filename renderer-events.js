const { ipcRenderer } = require('electron');

ipcRenderer.on('serial:getports:reply', (event, arg) => {
    // TODO: Populate a dropdown menu with the returned data
});