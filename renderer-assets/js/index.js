'use strict';
const { ipcRenderer } = require("electron");
const storage = require('electron-json-storage');
const $ = require('jquery');

// ** Global Variables **

// Number for unique IDs in VLANCreator
let customtxtincr = 0;

// Holds the VLAN inputs for the dual mode radio buttons
let dualmodevlanarray = [$('#UserVLAN'), $('#VOIPVLAN')];

// Global variable vlandict is the VLAN dictionary that gets passed to the main process to be stored
let vlandict = [];

let switchquantity;
let switchmodel;

// ** End of Global Variables **

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