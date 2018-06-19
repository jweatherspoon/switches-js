if(!$) {
    const $ = require('jquery');
}

// Retrieve the data from the last two forms
ipcRenderer.send('switchConfig:get', 'SwitchSelect');
ipcRenderer.send('switchConfig:get', 'VLANForm');

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
