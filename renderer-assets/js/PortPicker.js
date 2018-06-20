if(!$) {
    const $ = require('jquery');
}

// Retrieve the data from the last two forms
ipcRenderer.send('switchConfig:get', 'SwitchSelect');
ipcRenderer.send('switchConfig:get', 'VLANForm');

switchquantity;
switchmodel;

ipcRenderer.on('config:get:return', (event,args) => {
    console.log("Args:", args)
    console.log("Page:", args.page)
    if (args.page === 'SwitchSelect') {
        SelectArgs = args
        switchquantity = SelectArgs.quantity;
        switchmodel = SelectArgs.model;
    } else if (args.page === 'VLANForm') {
        VLANArgs = args
        alert(JSON.stringify(VLANArgs.VLANDictionary));
    }
});

FullSwitch = [];
for (let numberofswitchiebois = 0; numberofswitchiebois < switchquantity; numberofswitchiebois++) {
    FullSwitch[numberofswitchiebois] = new Array();
}

SwitchVLANPort = {
    
};

function PortMaker (portnumber,tagged,vlan) {
    SwitchVLANPort[portnumber] = {
        portnumber: portnumber,
        tagged: tagged,
        vlan: vlan,
    }
    return SwitchVLANPort[portnumber];
}

for (let switchnumber = 0; switchnumber < switchquantity; switchnumber++) {
    for (let portindex = 0; portindex < 48; portindex++) {
        CurrentPort = PortMaker(portindex,true,301);
        FullSwitch[switchnumber].push(CurrentPort);
    }

}