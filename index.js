'use strict';

const $ = require('jquery');

var indexdropdown = `<h1>What kind of switch do you have?</h1>
<select>
<option value="FWS">FWS</option>
<option value="ICX6450">ICX6450</option>
<option value="ICX7250">ICX7150</option>
<option value="ICX7150">ICX7250</option>
<option value="ICX7450">ICX7450</option>
</select>`

$("#fader").click(function(){
    $("#innerdiv").fadeOut();
    $("#innerdiv").text('Nice');
    setTimeout(function() {$("#innerdiv").html(indexdropdown).fadeIn();},600)
    });

