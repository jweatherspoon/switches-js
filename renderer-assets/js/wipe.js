const $ = require('jquery');
const { ipcRenderer } = require('electron');
const {
    GetPorts
} = require('../../helpers/serial');
const { Brocade } = require('../../models/switches/Brocade');

let interval;
let sw;

/**
 * Populate the ports list when it is sent back by the main process
 */
ipcRenderer.on("serial:getports:reply", (event, portsList) => {
    let ports = [];
    portsList.forEach(port => {
        let html = `
            <option value=${port.comName}>${port.comName}</option>
        `;
        ports.push(html);
    })

    ports.join('');
    $("#ports-list").html(ports);
})

// Ask the main process for a list of active serial ports
const GetPortsList = () => ipcRenderer.send("serial:getports");

/**
 * When the switch outputs some data, log it to the in-window console
 * @param {string} data - The data to be logged
 */
const LoggerCallback = (data) => {
    let output = document.createElement('div');
    output.className = 'console-text';
    output.innerText = data;

    let cons = document.getElementById('console-output');
    cons.appendChild(output);

    cons.scrollTo(0, cons.scrollHeight);
}

/**
 * Reset the status and wipe buttons for the user
 */
const ResetWipe = () => {
    $("#status").text("Hit wipe and then plug in the switch");
    $("#wipe-btn").attr("disabled", false);
}

/**
 * Handle updating the GUI when the user presses the connect / disconnect button
 * as well as handle the global switch interaction object
 */
$("#connect-btn").click(e => {
    if (!sw) {
        let port = $("#ports-list").val();
        sw = new Brocade(port, 9600, LoggerCallback);
        $("#connect-btn").text("Disconnect");
        $("#ports-list").attr('disabled', true);
        ResetWipe();
    } else {
        sw.disconnect();
        sw = null;
        $("#connect-btn").text("Connect");
        $("#status").text("Connect to a Port");
        $("#ports-list").attr('disabled', false);
        $("#wipe-btn").attr("disabled", true);
    }
})

/**
 * When the user clicks the wipe button, handle wiping the switch 
 * so long as one is connected
 */
$("#wipe-btn").click(e => {
    if (sw) {
        $("#status").text("Wiping...");
        $("#wipe-btn").attr('disabled', true);
        $("#console-output").text('');
        sw.wipe().then(() => ResetWipe());
    }
})

/**
 * Update the list of active serial connections every 5 seconds.
 */
$(document).ready(e => {
    GetPortsList();
    interval = window.setInterval(() => {
        GetPortsList();
    }, 5000)
})