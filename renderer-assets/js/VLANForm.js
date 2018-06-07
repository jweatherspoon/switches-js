if(!$) {
    const $ = require('jquery');
}

var newvlan = `<div style="padding: 10">
<input type="text" id="txtCustomVLAN" name="txtCustomVLAN" placeholder="Name of VLAN" style="padding-right: 10; width: 150;">
<input class="vlaninput" type="number" id="VOIPVLAN" name="VOIPVLAN" style="margin-left: 10" placeholder="VLAN">
</div>`

customvlancount = 4;

$('#btnCustomVLAN').click(function(){
    if (customvlancount > 1) {
        $(newvlan).insertBefore('#divbtnCustomVLAN');
        customvlancount --;
        $('#btnCustomVLAN').text('Add Custom VLAN (' + customvlancount + ')');
    } else {
        $(newvlan).insertBefore('#divbtnCustomVLAN');
        $('#btnCustomVLAN').hide();
    }
})

captioncounter = 0;
captionarray = [];

$('#btnVLANSubmit').click(function(){
    $('#divVLANForm').find('input').each(function(){
        if (this.value != '') {
            captionarray.push(captioncounter);
            captionarray.push(this.value);
        };
        captioncounter ++;
    });
    alert(captionarray);
})