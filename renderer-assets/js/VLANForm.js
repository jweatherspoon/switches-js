if (!$) {
    const $ = require('jquery');
}

dualmodevlanarray = [$('#UserVLAN'), $('#VOIPVLAN')];

duplicatearray = [];
duplicatenamearray = [];

/* Creates VLAN fields for CustomVLAN button.
   I would advise not touching this. It will blow up the page layout.*/
function VLANCreator(vlannumber) {
    var newvlan = `<div style="padding-left: 10; width: 420;" class='divCustomVLAN flex flex-align-center' id="divCustomVLAN${vlannumber}" onkeyup="CVLANAgainst(${vlannumber})">
<div>
<input type="text" id="txtCustomVLAN${vlannumber}" class="CVSelector1" name="txtCustomVLAN" placeholder="Name of VLAN" style="width: 156;">
<input class="vlaninput CVSelector2" type="number" id="txtVLAN${vlannumber}" onkeyup='VLANCheck(this)' name="txtVLAN" style="width: 125" placeholder="VLAN">
<input type="radio" name='dualmoderadio' id="DualModeVLAN${vlannumber}" inputid='txtVLAN${vlannumber}' class='DualModeVLANCheck' value="DualModeVLAN" onclick="dualmodevlanshifter(this)">DualMode
</div>
<div onclick="deletieboi('divCustomVLAN${vlannumber}','${vlannumber}')" id="btnVLANDelete${vlannumber}" style="padding: 9; cursor: pointer">&times;</div>
</div>`
    return newvlan;
}

/* This function checks to make sure if one custom input is not null the other one isn't either.
   First grabs the label and input and store them as variables.
   Then it checks to see if either of them are not null.*/
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

/* Error checker to make sure VLAN is in desired range.
   Is used in onkeyup functions in VLAN inputs to change background to red.*/
function VLANCheck(i) {
    i.value = parseInt(i.value)
    x = i.value;
    if (x < 0 || x > 4096) {
        i.style.backgroundColor = 'red';
    } else {
        i.style.backgroundColor = ''
    }
}

// Tracker for max amount of Custom Vlans
customvlancount = 4;

/* Creates Custom VLAN fields 
   First if statement checks if there are any more custom available vlans.
   If there are, makes a new one, if there is only one left it creates the new one then hides the button.
   Uses customtxtincr variable to make unique IDs in VLANCreator*/
$('#btnCustomVLAN').click(function () {
    if (customvlancount > 1) {
        cvlan = VLANCreator(customtxtincr);
        $(cvlan).insertBefore('#divbtnCustomVLAN');
        customvlancount--;
        $('#btnCustomVLAN').text('Add Custom VLAN (' + customvlancount + ')');
    } else {
        $(cvlan).insertBefore('#divbtnCustomVLAN');
        $('#btnCustomVLAN').hide();
    }
    customtxtincr++;
})

/* This function is for the div that deletes the custom VLANs
   First it checks to see whether the radio button is checked,
   if it is, it will shift UserVLAN into the dualmode array.
   Then it will continue on to calculate remaining custom divs.*/
function deletieboi(divid, radionumber) {
    if ($(`#DualModeVLAN${radionumber}`).is(':checked') == true) {
        $('#DualModeVLANUser').click();
    }
    if ($('#btnCustomVLAN').css('display') == 'none') {
        $(`#${divid}`).remove();
        $('#btnCustomVLAN').show();
    } else {
        $(`#${divid}`).remove();
        customvlancount++;
    }
    $('#btnCustomVLAN').text('Add Custom VLAN (' + customvlancount + ')');
}

// Submit button functions
$('#btnVLANSubmit').click(function () {
    duplicatearray = [];
    duplicatenamearray = [];
    flaggy = true;
    nothingcount = 0;
    inputcount = $('#divVLANForm').find('.vlaninput').length;
    $('#divVLANForm').find('.vlaninput').each(function () {

        /* Checks validity based on VLANCheck function
           Ends findeach loop if any boxes are red
           ** Change this later to check for correct input and background color** */
        if (this.style.backgroundColor == 'red') {
            alert("Please check any red input boxes for errors.");
            flaggy = false;
            return false;
        }

        // Counter to check against blank form
        if (this.value === '') {
            nothingcount++
        }

        // Checks for duplicate inputs using duplicatevlanchecker
        if (duplicatevlanchecker(this.value) != null) {
            alert('Please do not enter duplicate VLAN values.')
            flaggy = false;
            return false;
        }
    })

    // Checks to see if the selected dualmoded VLANs are filled out
    if ($('#dualmodedcheck').is(':checked') && (dualmodevlanarray[0].val() == '' || dualmodevlanarray[1].val() == '')) {
        alert(`You have dualmoded checked, and one or more of your dualmoded VLANs are not filled out. \n Fill them out or uncheck dualmoded.`)
        flaggy = false;
    }

    /* Checks against counter to make sure form isn't blank
       flaggy is a flag that stops the submit button from continuing further.*/
    if (nothingcount === inputcount) {
        alert(`What are you doing? Don't you want at least one VLAN?`);
        flaggy = false;
    }

    /* After all checks are completed, if flaggy is true the if statement checks to see how many inputs are on the form.
       This is to check if the user created any custom VLAN inputs which have a seperate dictionary function.
       If it is equal to the original 8 then it performs the original vlandictionary function, otherwise it does both
       the original and the customvlandictionary, which both add to the object :vlandict.
       **Remove alert ** */
    if (flaggy == true) {
        if (inputcount == 8) {
            vlandictionary();
        } else {
            vlandictionary();
            CVLANDictionary();
        }
        if (flaggy == true) {
            alert(JSON.stringify(vlandict));
            VLANDialog();
        }
    }
})

/* Dictionary creator for prefilled in VLANS 
   Finds each input, checks to see if it isn't empty.
   If it isn't empty it adds it to the global dictionary.*/
function vlandictionary() {
    vlandict = [];
    $('#divVLANForm').find('.OCVLAN').each(function () {
        if (this.value != '') {
            inputkey = $(this).attr('id');
            vlandict.push({
                VLANName: inputkey,
                VLANNumber: this.value
            })
        };
    });
}

// Dictionary creator for custom VLANs. Similar to vlandictionary function.
function CVLANDictionary() {
    $('#divVLANForm').find('.divCustomVLAN').each(function () {
        VLANInputName = $(this).find('.CVSelector1').val();
        VLANInput = $(this).find('.CVSelector2').val();
        if (VLANInputName != '' && VLANInput != '') {
            if (duplicatevlannamechecker(VLANInputName) != null) {
                alert('Please do not enter duplicate VLAN name values.')
                flaggy = false;
            } else {
                vlandict.push({
                    VLANName: VLANInputName,
                    VLANNumber: VLANInput
                });
            }
        } else {
            if (VLANInputName != '' && VLANInput == '') {
                vlanalertname = $(this).find('CVSelector1').val();
                alert(`Please input a VLAN for ${vlanalertname} or remove the name.`)
                flaggy = false;
            } else if (VLANInputName == '' && VLANInput != '') {
                alert('It looks like you have a custom VLAN with no name \nPlease name the VLAN.')
                flaggy = false;
            }
        }
    });
}


// Creates VLANDialog so the user can confirm the VLANs
function VLANDialog() {

    // Grabs the keys and values from the vlandict and stores them in variables. Then stores them in a string
    var VLANString = '';
    vlandict.forEach((K, index) => {
        vkey = JSON.stringify(K.VLANName)
        vval = JSON.stringify(K.VLANNumber)
        VLANString += vkey + ': ' + vval + '\n';
    });

    // Creates a dialog for the user to check their inputs one more time before moving on.
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
    //VLANSwitchConfig();
    $("#VLANFlexContainer").fadeOut();
    $("#VLANFlexContainer").html(memeteam);
    setTimeout(function () {
        $(document.body).load('./PortPickerTheJonWay.html')
    }, 500);
}
var memeteam = `<p style='font-size: 30;'>Wowzers</p>`

/* Send info to main process to be stored for later
function VLANSwitchConfig () { 
    ipcRenderer.send('switchConfig:set', {
        page: 'VLANForm',
        data : {
            VLANDictionary: vlandict,
            page: 'VLANForm',
            dualmodevlans: dualmodevlanarray
        }});
 } */

// Removes and inserts the inputid of the radio button into the dualmode array
function dualmodevlanshifter(myradioboi) {
    x = myradioboi.getAttribute('inputid')
    dualmodevlanarray.shift();
    dualmodevlanarray.unshift($(`#${x}`));
}

/* For the checkbox at the top of the page. 
   Checks if it is checked now or not
   Disables or enables the radio buttons for dual mode vlans*/
function DualModeCheckieBoi(mybox) {
    if (mybox.checked == true) {
        $('#divVLANForm').find('input[type=radio]').each(function () {
            $(this).attr('disabled', false);
        })
        $('#DualModeVLANVOIP').attr('disabled', true);
        $('#DualModeVLANVOIP').attr('checked', true);
        $('#DualModeVLANUser').attr('checked', true);
        dualmodevlanarray = [$('#UserVLAN'), $('#VOIPVLAN')];
    } else {
        $('#divVLANForm').find('input[type=radio]').each(function () {
            $(this).attr('checked', false);
            $(this).attr('disabled', true);
            dualmodevlanarray = [];
        })
    }
}

// Checks inputs againsts themselves to check for duplicates
function duplicatevlanchecker(vlannumber) {
    var checkie = duplicatearray.find(function (x) {
        return x == vlannumber;
    });
    if (checkie == null && vlannumber != '') {
        duplicatearray.push(vlannumber);
    }
    return checkie;
}

// Checks for duplicate custom vlan names
function duplicatevlannamechecker(vlanname) {
    var checkie = duplicatenamearray.find(function (x) {
        return x.toLowerCase() == vlanname.toLowerCase();
    });
    if (checkie == null && vlanname != '') {
        duplicatenamearray.push(vlanname)
    }
    return checkie;
}