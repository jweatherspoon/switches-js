if (!$) {
    const $ = require('jquery');
}

if (!ipcRenderer) {
    const { ipcRenderer } = require("electron");
}

// Send function to retrive switch model and quantity from SwitchSelect
ipcRenderer.send('switchConfig:get', 'SwitchSelect');

//Recieve function to retrieve switch model and quantity from SwitchSelect
ipcRenderer.on('config:get:return', (event, args) => {
    switchquantity = args.quantity;
    switchmodel = args.model;
    for (let i = 1; i < switchquantity; i++) {
        newswitchdiv = divswitchcreator(i);
        $(newswitchdiv).insertBefore('#enddiv');
    }
});

// Creates divs with info from reciever function
function divswitchcreator(num) {
    label = num + 1;
    newswitchdiv = `<div id="switch${num}" class='flex flex-justify-center' style="padding-top: 15">
    <label for="switch${num}okay" style="padding-right: 10">Switch ${label}</label>
    <button type="button" id="switch${num}okay" disabled='true' style='margin-left: 10' onclick='progressbartofifty(${num}); enableordisable(${num})'>Okay</button>
    <div id="progressbar${num}" style="width: 200; height: 18; margin-left: 10;margin-top: 2; outline: 2px solid black"><div id="progress${num}" style="background-color: green; width: 0; height: 18"></div></div>
    </div>`
    return newswitchdiv;
}

/* Slow ticking progress bar function. 
Says to fifty but should actually be set to 75. 
And interval should be set to 500.
It's triggered when the user presses okay */
function progressbartofifty(numby) {
    let currentprogress = 0;
    let progressticktofifty = setInterval(function () {
        if (currentprogress >= 25) {
            progressbarfinish(numby, currentprogress)
            clearInterval(progressticktofifty);
        } else {
            currentprogress++;
            $(`#progress${numby}`).css({ width: `${currentprogress}%` })
        }
    }, 50)
}

/* This function finishes out the progress bar when it is signaled by the main process.
Enables the next button. */
function progressbarfinish(numby, currentprogress) {
    let progresswidth = currentprogress;
    let progresstick = setInterval(function () {
        if (progresswidth >= 100) {
            if (numby === (switchquantity - 1)) {
                $('#btnSwitchStackSubmit').attr('disabled', false);
                $('#switchidentifier').text(`Should be good to go.`);
                $('#instructions').text('Please press Stacked to continue.')
                clearInterval(progresstick);
            } else {
                identifier = numby + 2
                enablethenext(numby);
                $('#switchidentifier').text(`Plug in Switch number ${identifier}`);
                clearInterval(progresstick);
            }
        } else {
            progresswidth++;
            $(`#progress${numby}`).css({ width: `${progresswidth}%` })
        }
    }, 25)
}

// For enabling buttons.
function enableordisable(numby) {
    button = $(`#switch${numby}okay`)
    buttonstatus = button[0].disabled
    if (buttonstatus == true) {
        button.attr('disabled', false);
    } else {
        button.attr('disabled', true);
    }
    return buttonstatus
}

// Enables next button when status is finished.
function enablethenext(numby) {
    numby++;
    enableordisable(numby);
}

$('#btnSwitchStackSubmit').click(function () {
    EventListenerRemoval();
    $("#innerdiv").fadeOut();
    $("#innerdiv").html(memedream);
    setTimeout(function () { $(document.body).load('./VLANForm.html') }, 500);
})

var memedream = `<p style='font-size: 30;'>Stacker Boy</p>`

function EventListenerRemoval() {
    ipcRenderer.removeAllListeners('config:get:return');
}

// Jonboi's Main process black magic store
// Please come in we're open for business :)

/**
 * Begin the configuration process for a given switch
 * @param {string} switchID - The HTML ID for the switch     
 * @param {*} switchCount - The total quantity of the switches
 */
const BeginConfiguration = (switchID, switchCount) => {
    ipcRenderer.send("stack:begin", {
        id: switchID,
        count: switchCount
    });
}

/**
 * Event received when the main process is ready for 
 * password bypass  
 */
ipcRenderer.on("stack:ready", (event, arg) => {

});

/**
 * Event received when the main process has cleared
 * the password on the current switch
 */
ipcRenderer.on("stack:response", (event, arg) => {

});

/**
 * Event received when the main process has finished
 * uploading the new code and stacking if applicable
 */
ipcRenderer.on("stack:fin", (event, arg) => {

});

