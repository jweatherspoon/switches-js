if(!$) {
    const $ = require('jquery');
}

// Number for unique IDs in VLANCreator
customtxtincr = 0;


// Creates VLAN fields for CustomVLAN button
function VLANCreator (vlannumber) {
    var newvlan = `<div style="padding: 10" class='divCustomVLAN' id="divCustomVLAN${vlannumber}" onkeyup="CVLANAgainst(${vlannumber})">
<input type="text" id="txtCustomVLAN${vlannumber}" class="CVSelector1" name="txtCustomVLAN" placeholder="Name of VLAN" style="margin-right: 10; width: 150;">
<input class="vlaninput CVSelector2" type="number" id="txtVLAN${vlannumber}" onkeyup='VLANCheck(this)' name="txtVLAN" style="margin-left: 10; width: 98" placeholder="VLAN">
<button type="button" onclick="deletieboi('divCustomVLAN${vlannumber}')" id="btnVLANDelete${vlannumber}">&times;</button>
</div>`
    return newvlan;
}

// Error checker to make sure if one custom input has characters the other custom input also has characters.
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

// Error checker to make sure VLAN is in desired range
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

// Submit button functions
$('#btnVLANSubmit').click(function(){
    inputcount = $('#divVLANForm').find('input').length;
    if (inputcount == 8) {
        vlandictionary();
    } else {
        vlandictionary();
        CVLANDictionary();
    }
    $('#divVLANForm').find('input').each(function (){
        if (this.style.backgroundColor == 'red') {
            alert("Please check any red input boxes for errors.");
            return false;
        } else {
            if ($('#dualmodedcheck').is(':checked') && $('#VOIPVLAN').val() == '') {
                alert('Please enter a VOIP VLAN or uncheck the dualmoded checkbox.');
                return false;
            } else {
                // Next page
            }
        }
    })
    alert(JSON.stringify(vlandict));
})

captioncounter = 0;
vlandict = [];
errorarray = [];
var inputkey;
var flag = false;

// Dictionary creator for prefilled in VLANS
function vlandictionary() {
    vlandict = [];
    captioncounter = 0;
    $('#divVLANForm').find('.OCVLAN').each(function() {
        if (this.value != '') {
            inputkey = $(`#divVLANForm input:eq(${captioncounter})`).attr('id');
            vlandict.push({
                key: inputkey,
                value: this.value
            })
        };
        captioncounter ++;
    });
}

// Dictionary creator for custom VLANs
function CVLANDictionary() {
    $('#divVLANForm').find('.divCustomVLAN').each(function() {
        tempkey = $(this).find('.CVSelector1').val();
        tempval = $(this).find('.CVSelector2').val();
        if (tempkey != '' && tempval != '') {
            vlandict.push({
                key: tempkey,
                value: tempval
            });
        } else {
            if (tempkey == '') {
                $(this).find('CVSelector1')
            }
        }
    });
}