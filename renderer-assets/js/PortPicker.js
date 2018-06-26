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

/* Creation of each switch array based upon the switchquantity
   ALso creates a button for each of the switch views*/
for (let numberofswitchiebois = 0; numberofswitchiebois < switchquantity; numberofswitchiebois++) {
    FullSwitch[numberofswitchiebois] = new Array();
    switchview = switchviewbutton(numberofswitchiebois);
    $('#switchswitcher').append(switchview);
}

// Creates the button for switching switch views
function switchviewbutton (switchnumber) {
    y = switchnumber + 1;
    x = `<button id='switchview${switchnumber}' onclick=switchviewswitch(this)>Switch: ${y}</button>`;
    return x
}

/* This function will switch between the switch view
   The switch views are just populated data from the full switch arrays
   When a button is clicked the port divs will fill with information from the fullswitch*/
function switchviewswitch(switchviewbutton) {

}

vlandict.forEach(vlan => {
    VLANName = vlan.VLANName;
    VLANNumber = vlan.VLANNumber;
    $(`<button>${VLANName}</br>VLAN:${VLANNumber}</button>`).insertBefore('#switchidentifier');
});

// Creates the port objects that are held within each fullswitch
function PortMaker (portnumber,dualmoded,vlan1name,vlan1,vlan2name,vlan2) {
    if (dualmoded === true) {
        SwitchVLANPort[portnumber] = {
            portnumber: portnumber,
            dualmoded: dualmoded,
            vlan1name: vlan1name,
            vlan1: vlan1,
            vlan2name: vlan2name,
            vlan2: vlan2
    }} else {
        SwitchVLANPort[portnumber] = {
            portnumber: portnumber,
            dualmoded: dualmoded,
            vlan1name: vlan1name,
            vlan1: vlan1,
    }}
    return SwitchVLANPort[portnumber];
}

/* For loop for every switch that leads into the for loop for each port
   CurrentPort holds the variable for the PortMaker function.
   The PortMaker function needs the arguments: portindex, dualmoded boolean, vlan(s)*/
for (let switchnumber = 0; switchnumber < switchquantity; switchnumber++) {
    for (let portindex = 1; portindex < 49; portindex++) {
        if (dualmodevlanarray != null) {
            v1n = dualmodevlanarray[0].attr('id');
            v1 = dualmodevlanarray[0].val();
            v2n = dualmodevlanarray[1].VLANName;
            v2 = dualmodevlanarray[1].VLANNumber;
            CurrentPort = PortMaker(portindex, true,v1n,v1,v2n,v2);
            FullSwitch[switchnumber].push(CurrentPort);
        }
        //CurrentPort = PortMaker(portindex,true,301);
        //FullSwitch[switchnumber].push(CurrentPort);
    }

}