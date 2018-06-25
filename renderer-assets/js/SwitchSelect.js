if(!$) {
    const $ = require('jquery');
}

if(!ipcRenderer) {
    const { ipcRenderer } = require("electron");
}

$("#switchsubmit").click(function(){
    x = $('#NumberofSwitches').val();
    y = $('#switchselector').val();
    if (y != null && x != '' && x > 0 && x < 11) {
        SwitchSelectConfig(y,x);
        $(".innerdiv").fadeOut();
        $(".innerdiv").text('Good Job');
        setTimeout(function() {$(document.body).load('./SwitchStack.html')},500);
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