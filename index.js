'use strict';
const {ipcRenderer} = require("electron");
const $ = require('jquery');

$("#fader").click(function(){
    $(".innerdiv").fadeOut();
    $(".innerdiv").text('Nice');
    setTimeout(function() {ipcRenderer.send('loadpage','SwitchSelect.html')},500);
    });
