'use strict';
const { ipcRenderer } = require("electron");
const storage = require('electron-json-storage');
const $ = require('jquery');

// ** Global Variables **

// Global variables for Switch Stack
let switchquantity;
let switchmodel;

// Number for unique IDs in VLANCreator for VLANForm
let customtxtincr = 0;

// Holds the VLAN inputs for the dual mode radio buttons for VLANForm
let dualmodevlanarray = [];

// Global variable vlandict is the VLAN dictionary that gets passed to the main process to be stored for VLANForm
let vlandict = [];

// Global array declaration to create each switch to hold their respective ports for PortPicker
let FullSwitch = [];

// Global object declaration to set each port on a switch for PortPicker
let SwitchVLANPort = {
    
};

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