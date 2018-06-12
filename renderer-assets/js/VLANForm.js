if(!$) {
    const $ = require('jquery');
}

customtxtincr = 0;

var newvlan = `<div style="padding: 10">
<input type="text" id="txtCustomVLAN${customtxtincr}" name="txtCustomVLAN" placeholder="Name of VLAN" style="padding-right: 10; width: 150;">
<input class="vlaninput" type="number" id="txtVLAN" name="txtVLAN" style="margin-left: 10" placeholder="VLAN">
<button type="button" id="btnVLANDelete${customtxtincr}">&times;</button>
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
    customtxtincr ++;
})

captioncounter = 0;
captiongrab = 0;
vlandict = [];
errorarray = [];
var inputkey;
var flag = false;

$('#btnVLANSubmit').click(function(){
    vlandict = [];
    captioncounter = 0;
    flag = false;
    $('#divVLANForm').find('input').each(function(){
        if (this.value != '') {
            if (this.value <= 4096 && this.value >= 0) {
                inputkey = $(`#divVLANForm input:eq(${captioncounter})`).attr('id');
            vlandict.push({
                key: inputkey,
                value: this.value
            });
            } else {
                flag = true;
                errorarray.push($(`#divVLANForm label:eq(${captioncounter})`).text().slice(0,-1));
            }
        }
        if (customvlancount < 4) {
            
        }
        captioncounter ++;
    });
    if (flag == false) {
        alert(JSON.stringify(vlandict));
    } else {
        alert("Please fix the following: " + errorarray);
    }
})