const $ = require('jquery');
const { ipcRenderer } = require('electron');
const {
    GetPorts
} = require('../../helpers/serial');
const { Brocade } = require('../../models/switches/Brocade');

let interval;
let sw;

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

const GetPortsList = () => ipcRenderer.send("serial:getports");

const LoggerCallback = (data) => {
    let output = document.createElement('div');
    output.className = 'console-text';
    output.innerText = data;

    let cons = document.getElementById('console-output');
    cons.appendChild(output);

    cons.scrollTo(0, cons.scrollHeight);
}

const ResetWipe = () => {
    $("#status").text("Hit wipe and then plug in the switch");
    $("#wipe-btn").attr("disabled", false);
}

$(document).ready(e => {
    GetPortsList();
    interval = window.setInterval(() => {
        GetPortsList();
    }, 5000)
})

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

$("#wipe-btn").click(e => {
    if (sw) {
        $("#status").text("Wiping...");
        $("#wipe-btn").attr('disabled', true);
        $("#console-output").text('');
        sw.wipe().then(() => ResetWipe());
    }
})