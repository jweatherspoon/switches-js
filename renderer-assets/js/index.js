'use strict';
const {ipcRenderer} = require("electron");
const $ = require('jquery');

$("#fader").click(function(){
    $(".innerdiv").fadeOut();
    $(".innerdiv").text('Nice');
    setTimeout(function() {$(document.body).load('./SwitchSelect.html')},500);
    });

ipcRenderer.send('filesys:checkver', {
    model: "ICX 7150",
    site: "ruckus",
})