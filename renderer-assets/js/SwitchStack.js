if(!$) {
    const $ = require('jquery');
}

if(!ipcRenderer) {
    const { ipcRenderer } = require("electron");
}

var switchquantity;
var switchmodel;

ipcRenderer.send('switchConfig:get', 'SwitchSelect');

ipcRenderer.on('config:get:return', (event,args) => {
    switchquantity = args.quantity;
    switchmodel = args.model;
    for (let i = 0; i < switchquantity - 1; i++) {
        newswitchdiv = divswitchcreator(i + 1);
        $(newswitchdiv).insertBefore('#enddiv');
    }
});

function divswitchcreator(num) {
    newswitchdiv = `<div id="switch${num}" class='flex flex-justify-center' style="padding-top: 15">
    <label for="switch${num}okay" style="padding-right: 10">Switch 1</label>
    <button type="button" id="switch${num}okay" style='margin-left: 10'>Okay</button>
    </div>`
    return newswitchdiv;
}

$('#switch0okay').click(function () {
    progressbar();
})

function progressbar() {
    progresswidth = 0;
    progresstick = setInterval(function() {
        if (progresswidth >= 100) {
            clearInterval(progresstick)
        } else {
            progresswidth ++;
            $('#progress').css({width:`${progresswidth}%`})
        }
    }, 100)
}