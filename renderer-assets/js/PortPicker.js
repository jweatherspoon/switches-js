if(!$) {
    const $ = require('jquery');
}

ipcRenderer.send('switchConfig:get', 'SwitchSelect');
ipcRenderer.send('switchConfig:get', 'VLANForm');

ipcRenderer.on('config:get:return', (event,args) => {
    console.log(args)
    console.log(args.page)
    if (args.page === 'SwitchSelect') {
        switchquantity = args.quantity;
        switchmodel = args.model;
    } else if (args.page === 'VLANForm') {
        alert(JSON.stringify(args.VLANDictionary));
    }
});
