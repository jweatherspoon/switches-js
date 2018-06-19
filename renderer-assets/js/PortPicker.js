if(!$) {
    const $ = require('jquery');
}

ipcRenderer.send('switchConfig:get', 'SwitchSelect');
ipcRenderer.send('switchConfig:get', 'VLANForm');

ipcRenderer.on('config:get:return', (event,args) => {
    console.log(args)
    console.log(args.page)
    if (args.page === 'SwitchSelect') {
        SelectArgs = args
        switchquantity = SelectArgs.quantity;
        switchmodel = SelectArgs.model;
    } else if (args.page === 'VLANForm') {
        VLANArgs = args
        alert(JSON.stringify(VLANArgs.VLANDictionary));
    }
});
