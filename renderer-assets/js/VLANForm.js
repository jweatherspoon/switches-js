if(!$) {
    const $ = require('jquery');
}

const {
    dialog
} = require('electron').remote

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
    flaggy = true;
    nothingcount = 0;
    inputcount = $('#divVLANForm').find('input').length;
    $('#divVLANForm').find('input').each(function (){
        if (this.style.backgroundColor == 'red') {
            alert("Please check any red input boxes for errors.");
            flaggy = false;
            return false;
        } else {
            if ($('#dualmodedcheck').is(':checked') && $('#VOIPVLAN').val() == '') {
                alert('Please enter a VOIP VLAN or uncheck the dualmoded checkbox.');
                flaggy = false;
                return false;
            }
        }
        if (this.value === '') {
            nothingcount ++
        }
    })
    if (nothingcount === inputcount) {
        alert(`What are you doing? Don't you want at least one VLAN?`);
        flaggy = false;
    } else if (nothingcount === (inputcount - 1) && $('#VOIPVLAN').val() != '' && $('#dualmodedcheck').is(':checked')) {
        alert('Need at least two VLANs for dualmoded.');
        flaggy = false;
    }
    if (flaggy == true) {
        if (inputcount == 8) {
            vlandictionary();
        } else {
            vlandictionary();
            CVLANDictionary();
        }
        alert(JSON.stringify(vlandict));
        VLANDialog();
    }
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


// Creates VLANDialog so the user can confirm the VLANs
function VLANDialog () {
    var VLANString = '';
    vlandict.forEach((K, index) => {
        vkey = JSON.stringify(K.key)
        vval = JSON.stringify(K.value)
        VLANString += vkey + ': ' + vval + '\n' ;
    });
    dialog.showMessageBox(
        options = {
        type: 'info',
        title: 'Your VLANs',
        buttons: ['Looks good!', 'Whoops I messed up.'],
        message: VLANString,
        }, (index) => {
            if (index == 0) {
                portpickerhtml();
            } else {
                return false;
            }
        }
    )
}

// Next page
function portpickerhtml() {
        VLANSwitchConfig();
        $("#VLANFlexContainer").fadeOut();
        $("#VLANFlexContainer").html(memeteam);
        setTimeout(function () { $(document.body).load('./PortPicker.html') }, 500);
}

var memeteam = `<p style='font-size: 30;'>Wowzers</p>`

function VLANSwitchConfig () { 
    ipcRenderer.send('switchConfig:set', {
        page: 'VLANForm',
        data : {
            VLANDictionary: vlandict,
            page: 'VLANForm'
        }});
 }