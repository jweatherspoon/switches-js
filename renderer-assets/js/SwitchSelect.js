if(!$) {
    const $ = require('jquery');
}

if(!ipcRenderer) {
    const { ipcRenderer } = require("electron");
}

$("#switchsubmit").click(function(){
    switchquantity = $('#NumberofSwitches').val();
    switchmodel = $('#switchselector').val();
    if (switchmodel != null && switchquantity != '' && switchquantity > 0 && switchquantity < 11) {
        
        CreateStack(switchmodel, switchquantity);

        $(".innerdiv").fadeOut();
        $(".innerdiv").text('Good Job');
        setTimeout(function() {$(document.body).load('./get-updated-code.html')},500);
    };
});

function SwitchSelectEC(i) {
    i.value = parseInt(i.value);
    x = i.value;
    if (x < 1 || x > 10) {
        i.style.backgroundColor = 'red';
    } else {
        i.style.backgroundColor = ''
    }
}

/* function SwitchSelectConfig(model, quantity) {
    ipcRenderer.send('switchConfig:set', {
        page: 'SwitchSelect',
        data : {
            page: 'SwitchSelect',
            model: model,
            quantity: quantity}});
} */