'use strict';
const { ipcRenderer } = require("electron");
const storage = require('electron-json-storage');
const $ = require('jquery');

$("#fader").click(function () {
    $(".innerdiv").fadeOut();
    $(".innerdiv").text('Nice');
    setTimeout(function () { $(document.body).load('./SwitchSelect.html') }, 500);
});

$(document).ready(() => {
    storage.has('first-start', (err, hasKey) => {
        if(err || !hasKey) {
            storage.set('first-start', 'false');
            ipcRenderer.send("configmenu:show");
        }
    });
})