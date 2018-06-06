const $ = require('jquery');
const storage = require('electron-json-storage');

let settings = {};

function LoadSettings() {
    const keys = [
        "tftpDirectory"
    ];

    storage.getMany(keys.map(obj => obj.key), (err, data) => {
        if(err) console.log(err);

        keys.forEach(key => {
            console.log(data[key]);            
        })
    })
}

LoadSettings();

$("#tftp-dir-btn").click(() => {
    $("#tftp-dir").click()
});

$("#tftp-dir").change(() => {
    $("#tftp-dir-text").text(
        $("#tftp-dir").val()
    )
})

