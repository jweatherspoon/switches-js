if(!$) {
    const $ = require('jquery');
}

$("#switchsubmit").click(function(){
    if ($("#switchselector").val() !== null) {
        $(".innerdiv").fadeOut();
        $(".innerdiv").text('Good Job');
        setTimeout(function() {$(document.body).load('./Forms.html')},500);
    };
    });