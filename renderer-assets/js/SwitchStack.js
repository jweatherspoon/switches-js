if (!$) {
    const $ = require('jquery');
}

if (!ipcRenderer) {
    const { ipcRenderer } = require("electron");
}

let connectionInterval;
let currentprogress;

/* Send function to retrive switch model and quantity from SwitchSelect
ipcRenderer.send('switchConfig:get', 'SwitchSelect'); */

/* Recieve function to retrieve switch model and quantity from SwitchSelect
ipcRenderer.on('config:get:return', (event, args) => {
    switchquantity = args.quantity;
    switchmodel = args.model;
    for (let i = 1; i < switchquantity; i++) {
        newswitchdiv = divswitchcreator(i);
        $(newswitchdiv).insertBefore('#enddiv');
    }
}); */

for (let i = 1; i < switchquantity; i++) {
    newswitchdiv = divswitchcreator(i);
    $(newswitchdiv).insertBefore('#enddiv');
}

// Creates divs with info from reciever function
function divswitchcreator(num) {
    label = num + 1;
    newswitchdiv = `<div id="switch${num}" class='flex flex-justify-center' style="padding-top: 15">
    <label for="switch${num}okay" style="padding-right: 10">Switch ${label}</label>
    <button type="button" id="switch${num}okay" disabled='true' style='margin-left: 10' onclick='BeginConfiguration(${num})'>Okay</button>
    <div id="progressbar${num}" style="width: 200; height: 18; margin-left: 10;margin-top: 2; outline: 2px solid black"><div id="progress${num}" style="background-color: green; width: 0; height: 18"></div></div>
    </div>`
    return newswitchdiv;
}

/* Slow ticking progress bar function. 
Says to fifty but should actually be set to 75. 
And interval should be set to 500.
It's triggered when the user presses okay */
function progressbartofifty(numby) {
    currentprogress = 0;
    let progressticktofifty = setInterval(function () {
        if (currentprogress >= 50) {
            // progressbarfinish(numby, currentprogress)
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
                $('#switchidentifier').text(`Attach the console cable to Switch number ${identifier}`);
                $("#instructions").text("Don't power it on. Press okay when you've attached the cable.");
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
 * Populate the port-list dropdown menu with active serial ports
 */
ipcRenderer.on("serial:getports:reply", (event, portsList) => {
    let ports = "<option>Please Connect a Switch</option>";

    // Generate the html for the dropdown menu
    if(portsList.length > 0) {
        ports = [];
        portsList.forEach(port => {
            let html = `
                <option value=${port.comName}>${port.comName}</option>
            `;
            ports.push(html);
        })
    
        ports.join('');
        
        // Allow the user to connect
        $("#connect-btn").attr('disabled', false);
    } else {
        // Disable the button if no ports are active
        $("#connect-btn").attr("disabled", true);
    }

    $("#ports-list").html(ports);
});

/**
 * Get a list of active serial ports from the main process
 * @returns {string[]} A list of active serial port COM names
 */
const GetPortsList = () => ipcRenderer.send("serial:getports");

/**
 * Try connecting to a serial port
 */
const TryConnect = async () => {
    let val = $("#ports-list").val();
    if(val) {
        ipcRenderer.send("serial:connect", {
            portName: val,
            baudRate: 9600,
            model: switchmodel,
        });
    } else {
        // TODO: Alert the user to select a serial port
    }
}

/**
 * Update the HTML for the page when a successful connection is made
 * or alert the user that the connection failed
 */
ipcRenderer.on("serial:connected", async (event, status) => {
    // Hide this menu and display the stacking one
    if (status) {
        clearInterval(connectionInterval);
        $("#connect-container").fadeOut(100);
        await wait(100);
        $("#config-container").fadeIn(100);
    } else {
        // TODO: Alert the user that the connection failed
    }
})

/**
 * Begin the configuration process for a given switch
 * @param {string} switchID - The HTML ID for the switch     
 */
const BeginConfiguration = (switchID) => {
    ipcRenderer.send("stack:begin", {
        id: switchID,
        codeVer: "08061b",
        template: "template.startup",
        priority: 250 - (switchID * 10),
    });
}

/**
 * Event received when the main process is ready for 
 * password bypass  
 */
ipcRenderer.on("stack:ready", (event, id) => {
    console.log("recv ready", id);
    enableordisable(id);
    $("#instructions").text("Power the switch on. I'll start when it's booted up.");
});

/**
 * Event received when the main process has cleared
 * the password on the current switch
 */
ipcRenderer.on("stack:response", (event, arg) => {
    console.log("recv response", arg);
    $("#instructions").text("Please wait while I update the switch for you...");
    progressbartofifty(arg.id);
    enableordisable(arg.id);
});

/**
 * Event received when the main process has finished
 * uploading the new code and stacking if applicable
 */
ipcRenderer.on("stack:fin", (event, arg) => {
    console.log("recv fin", arg);
    progressbarfinish(arg.id, currentprogress);
});

$(document).ready(() => {
    GetPortsList();
    connectionInterval = setInterval(() => {
        GetPortsList()
    }, 2500);
});

$('#next-page').click(function () {
    EventListenerRemoval();
    $("#innerdiv").fadeOut();
    $("#innerdiv").html(memedream);
    setTimeout(function () { $(document.body).load('./VLANForm.html') }, 500);
})