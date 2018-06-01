'use strict';

const $ = require('jquery');

const SerialPort = require('serialport');
const Parsers = SerialPort.parsers;

const parser = new Parsers.Readline({
    delimeter: '\n'
});

parser.on('data', console.log);

let port;

/**
 * Get a list of active serial ports. Each port contains a COM name and id
 * @returns {object[]} Active serial ports
 */
function GetPorts() {
    var devices = [];
    SerialPort.list((err, ports) => {
        ports.forEach(port => {
            if(port.pnpId) {
                devices.push({
                    name: port.comName,
                    id: port.pnpId
                });
            }
        });
    });
    return devices;
}

/**
 * Open a serial connection given a port and baudrate
 * @param {string} portname - The COM port of the serial device
 * @param {number} baudRate - The baud rate used to communicate with the device
 * @returns {SerialPort} Connection to the specified serial device
 */   
function OpenPort(portname, baudRate) {
    return new SerialPort(portname, {
        baudRate: baudRate
    });
}

function test() {
    return $("#switchstart");
}

$("#fader").click(function(){
    $("#innerdiv").fadeOut();
    $("#innerdiv").text('Nice').next().fadein(slow);  
    });

