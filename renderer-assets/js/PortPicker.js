if(!$) {
    const $ = require('jquery');
}

/*
ipcRenderer.send('switchConfig:get', 'SwitchSelect');
ipcRenderer.send('switchConfig:get', 'VLANForm');*/

/* Recieving data from the sned:recieve
ipcRenderer.on('config:get:return', (event,args) => {

    // Sync, so the function needs to check which info it is recieveing
    if (args.page === 'SwitchSelect') {
        SelectArgs = args
        switchquantity = SelectArgs.quantity;
        switchmodel = SelectArgs.model;
    } else if (args.page === 'VLANForm') {
        VLANDictionary = args.VLANDictionary;
        dualmode = args.dualmodevlans;
        alert(JSON.stringify(VLANDictionary));
    }
}); */

let currentvlan1name;
let currentvlan1number;
let currentvlan2name;
let currentvlan2number;
let currentdualmoded = false;
let currentuplinkbool = false;
let currentdownlinkbool = false;
let currentswitch = 0;
let currentcolor = 'white';
let currentdualmodecolor = '#D7FDEC';
let colordictionary = ['white','#A9FBD7','#6290C3','#B0C6CE','938BA1','#FFCAD4','#FFE5D9','#ED6A5A','#67597A','#7189FF','#594E36','#C2A878'];
let lightshowbool = false;

/* Creation of each switch array based upon the switchquantity
   ALso creates a button for each of the switch views*/
for (let numberofswitchiebois = 0; numberofswitchiebois < switchquantity; numberofswitchiebois++) {
    FullSwitch[numberofswitchiebois] = new Array();
    switchview = switchviewbutton(numberofswitchiebois);
    $('#switchswitcher').append(switchview);
}


async function lightshow() {
    i = 0;
    lightshowinterval = setInterval( async() => {
        $(`#switchview${i}`).trigger('click');
        if (i <= switchquantity) {
            i ++
        } else {
            i = 0
        }
        await wait (500)
        lightshow()
    }, 500)
}

function lightshowstop() {
    for (var i = 0; i < (lightshowinterval * 2); i++) { 
        clearInterval(i)
    }
}

// Creates the button for switching switch views
function switchviewbutton (switchnumber) {
    y = switchnumber + 1;
    x = `<button id='switchview${switchnumber}' class='switchviewclass' onclick="switchviewswitch(${switchnumber})">Switch: ${y}</button>`;
    return x
}

/* This function will switch between the switch view
   The switch views are just populated data from the full switch arrays
   When a button is clicked the port divs will fill with information from the fullswitch*/
function switchviewswitch(switchviewbuttonnum) {
    FullSwitch[switchviewbuttonnum].forEach((i, indexie) => {
        divnumber = indexie + 1;
        if (i.dualmoded == true) {
            x = i.vlan1name;
            y = i.vlan2name;
            portviewdiv = portviewdualmode(divnumber,x,y);
            $(`#port${divnumber}`).html(portviewdiv);
            $(`#port${divnumber}`).css('background-color',i.color)
        } else {
            x = i.vlan1name;
            portviewdiv = portviewuntagged(divnumber,x);
            $(`#port${divnumber}`).html(portviewdiv);
            $(`#port${divnumber}`).css('background-color',i.color)
        }
        currentswitch = switchviewbuttonnum;
    });
}

vlandict.forEach((vlan,index) => {
        VLANName = vlan.VLANName;
        VLANNumber = vlan.VLANNumber;
        $(`<div><button class="vlanbar" style="background-color: ${colordictionary[index]}; width: 90; margin-bottom: 5" onclick="currentvlanchanger('${VLANName}',${VLANNumber},${index},false,false,this)">${VLANName}</br>VLAN:${VLANNumber}</button></div>`).insertBefore('#switchidentifier');
});

function currentvlanchanger(vlannam,vlannum,colorindex,currentuplink,currentdownlink,thebutton) {
    if (currentuplink == true) {
        currentuplinkbool = true;
        currentdownlinkbool = false;
    } else if (currentdownlink == true) {
        currentdownlinkbool = true;
        currentuplinkbool = false;
    } else {
        currentvlan1name = vlannam;
        currentvlan1number = vlannum;
        currentcolor = colordictionary[colorindex];
        currentuplinkbool = false;
        currentdownlinkbool = false;
    }
    $('.vlanbuttonbar').find('button').each(function (){
        $(this).css('opacity', '.65')
    })
    thebutton.style.opacity = 1;
}

// Creates the port objects that are held within each fullswitch
function PortMaker (portnumber,dualmoded,color,uplink,downlink,vlan1name,vlan1,vlan2name,vlan2) {
    if (uplink == true) {
        SwitchVLANPort[portnumber] = {
            portnumber: portnumber,
            uplink: uplink
        }
    } else if (downlink == true) {
        SwitchVLANPort[portnumber] = {
            portnumber: portnumber,
            downlink: downlink
        }
    } else {
        if (dualmoded === true) {
            SwitchVLANPort[portnumber] = {
                portnumber: portnumber,
                dualmoded: dualmoded,
                color: color,
                vlan1name: vlan1name,
                vlan1: vlan1,
                vlan2name: vlan2name,
                vlan2: vlan2
        }} else {
            SwitchVLANPort[portnumber] = {
                portnumber: portnumber,
                dualmoded: dualmoded,
                color: color,
                vlan1name: vlan1name,
                vlan1: vlan1,
        }}
    }
    return SwitchVLANPort[portnumber];
}

/* For loop for every switch that leads into the for loop for each port
   CurrentPort holds the variable for the PortMaker function.
   The PortMaker function needs the arguments: portindex, dualmoded boolean, vlan(s)*/
for (let switchnumber = 0; switchnumber < switchquantity; switchnumber++) {
    for (let portindex = 1; portindex < 49; portindex++) {
        if (dualmodevlanarray.length != 0) {
            v2n = dualmodevlanarray[0].attr('id');
            v2 = dualmodevlanarray[0].val();
            v1n = dualmodevlanarray[1].attr('id');
            v1 = dualmodevlanarray[1].val();
            CurrentPort = PortMaker(portindex,true,currentdualmodecolor,false,false,v1n,v1,v2n,v2);
            FullSwitch[switchnumber].push(CurrentPort);
        } else {
            v1n = vlandict[0].VLANName;
            v1 = vlandict[0].VLANNumber;
            CurrentPort = PortMaker(portindex, false, currentcolor,false,false, v1n, v1);
            FullSwitch[switchnumber].push(CurrentPort);
        }
        //CurrentPort = PortMaker(portindex,true,301);
        //FullSwitch[switchnumber].push(CurrentPort);
    }

}

// Fills the Port divs with the information from the FullSwitches that were created
for (let portdiv = 0; portdiv <= 47; portdiv++) {
    if (dualmodevlanarray.length != 0) {
        x = FullSwitch[0][portdiv].vlan1name;
        y = FullSwitch[0][portdiv].vlan2name;
        divnumber = portdiv + 1;
        portviewdiv = portviewdualmode(divnumber,x,y);
        $(`#port${divnumber}`).html(portviewdiv);
        $(`#port${divnumber}`).css('background-color',FullSwitch[0][portdiv].color);
    } else {
        x = FullSwitch[0][portdiv].vlan1name;
        divnumber = portdiv + 1;
        portviewdiv = portviewuntagged(divnumber,x);
        $(`#port${divnumber}`).html(portviewdiv);
        $(`#port${divnumber}`).css('background-color',FullSwitch[0][portdiv].color);
    }
    
}

// Creates the div with dualmode information from each port for the FullSwitch
function portviewdualmode(portnum, vlan1name, vlan2name) {
    x = `<div>${portnum}</div>
     <div>${vlan1name} \n ${vlan2name}</div>`
     return x;
}

// Creates the div with untagged information from each port for the FullSwitch
function portviewuntagged(portnum, vlan1name) {
    x = `<div>${portnum}</div>
    <div>${vlan1name}</div>`
    return x;
}

function divclickportchanger(thisport) {
    if (currentvlan1name != null || (currentdownlinkbool != false || currentuplinkbool != false)) {
        arrayindex = thisport - 1;
        if (currentuplinkbool == true) {
            newport = PortMaker(thisport,false,'#00FF7F',currentuplinkbool,currentdownlinkbool);
            FullSwitch[currentswitch].splice(arrayindex,1,newport);
            singleport = portviewuntagged(thisport,'Uplink');
            $(`#port${thisport}`).html(singleport);
            $(`#port${thisport}`).css('background-color','#00FF7F');
        } else if (currentdownlinkbool == true) {
            newport = PortMaker(thisport,false,'#32CD32',currentuplinkbool,currentdownlinkbool);
            FullSwitch[currentswitch].splice(arrayindex,1,newport);
            singleport = portviewuntagged(thisport,'Downlink');
            $(`#port${thisport}`).html(singleport);
            $(`#port${thisport}`).css('background-color','#32CD32');
        } else {
            if (currentdualmoded  == true) {
                newport = PortMaker(thisport,true,currentcolor,false,false,currentvlan1name,currentvlan1number,currentvlan2name,currentvlan2number);
                FullSwitch[currentswitch].splice(arrayindex,1,newport);
                singleport = portviewuntagged(thisport,currentvlan1name);
                $(`#port${thisport}`).html(singleport);
                $(`#port${thisport}`).css('background-color',currentcolor)
            } else {
                newport = PortMaker(thisport,false,currentcolor,false,false,currentvlan1name,currentvlan1number);
                FullSwitch[currentswitch].splice(arrayindex,1,newport);
                singleport = portviewuntagged(thisport,currentvlan1name);
                $(`#port${thisport}`).html(singleport);
                $(`#port${thisport}`).css('background-color',currentcolor)
            }
        }
    } else {
        alert('Select a VLAN to change the ports!')
    }
}

