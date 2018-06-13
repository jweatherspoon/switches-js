if(!$) {
    const $ = require('jquery');
}

// Number for unique IDs in VLANCreator
customtxtincr = 0;


// Creates VLAN fields for CustomVLAN button
function VLANCreator (vlannumber) {
    var newvlan = `<div style="padding: 10" class='divCustomVLAN' id="divCustomVLAN${vlannumber}">
<input type="text" id="txtCustomVLAN${vlannumber}" onfocusout="CVLANAgainst(${vlannumber})" class="CVSelector1" name="txtCustomVLAN" placeholder="Name of VLAN" style="margin-right: 10; width: 150;">
<input class="vlaninput CVSelector2" type="number" id="txtVLAN${vlannumber}" onchange='VLANCheck(this)' onfocusout="CVLANAgainst(${vlannumber})" name="txtVLAN" style="margin-left: 10; width: 98" placeholder="VLAN">
<button type="button" onclick="deletieboi('divCustomVLAN${vlannumber}')" id="btnVLANDelete${vlannumber}">&times;</button>
</div>`
    return newvlan;
}

function CVLANAgainst(vlannum) {
    tvlanname = $(`#txtCustomVLAN${vlannum}`);
    tvlannum = $(`#txtVLAN${vlannum}`);
    if (tvlanname.val() == '' && tvlannum.val() != '') {
        $(tvlanname).css('background-color', 'red');
    } else if (tvlanname.val() != '' && tvlannum.val() == '') {
        $(tvlannum).css('background-color', 'red');
    } else {
        $(tvlanname).css('background-color', '');
        $(tvlannum).css('background-color', '');;
    }
}

function VLANCheck(i) {
    x = i.value;
    if (x < 0 || x > 4096) {
        i.style.backgroundColor = 'red';
    } else {
        i.style.backgroundColor = ''
    }
}

// Tracker for max amount of Custom Vlans
customvlancount = 4;

// Creates VLAN fields
$('#btnCustomVLAN').click(function(){
    if (customvlancount > 1) {
        cvlan = VLANCreator(customtxtincr);
        $(cvlan).insertBefore('#divbtnCustomVLAN');
        customvlancount --;
        $('#btnCustomVLAN').text('Add Custom VLAN (' + customvlancount + ')');
    } else {
        $(cvlan).insertBefore('#divbtnCustomVLAN');
        $('#btnCustomVLAN').hide();
    }
    customtxtincr ++;
})

// Deletes custom VLAN
function deletieboi(divid) {
    if ($('#btnCustomVLAN').css('display') == 'none') {
        $(`#${divid}`).remove();
        $('#btnCustomVLAN').show();
    } else {
        $(`#${divid}`).remove();
        customvlancount ++;
    }
    $('#btnCustomVLAN').text('Add Custom VLAN (' + customvlancount + ')');
}

captioncounter = 0;
captiongrab = 0;
vlandict = [];
errorarray = [];
var inputkey;
var flag = false;

$('#btnVLANSubmit').click(function(){
    inputcount = $('#divVLANForm').find('input').length;
    if (inputcount == 8) {
        vlandictionary();
    } else {
        //vlandictionary();
        CVLANDictionary();
    }
})

function vlandictionary() {
    vlandict = [];
    captioncounter = 0;
    flag = false;
    $('#divVLANForm').find('.OCVLAN').each(function(){
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
        captioncounter ++;
    });
    if (flag == false) {
        alert(JSON.stringify(vlandict));
    } else {
        alert("Please fix the following: " + errorarray);
    }
}

tempvlandict = [];

function CVLANDictionary() {
    $('#divVLANForm').find('.divCustomVLAN').each(function() {
        tempkey = $(this).find('.CVSelector1').val();
        tempval = $(this).find('.CVSelector2').val();
        if (tempkey != '' && tempval != '') {
            tempvlandict.push({
                key: tempkey,
                value: tempval
            });
        } else {
            if (tempkey == '') {
                $(this).find('CVSelector1')
            }
        }
    });
    alert(JSON.stringify(tempvlandict));
}