const $ = require('jquery');
const storage = require('electron-json-storage');

let settings = {};

const keys = [
    {
        key: "tftp-directory",
        contentID: "#tftp-dir-text"
    }
];

function LoadSettings() {

    storage.getMany(keys.map(obj => obj.key), (err, data) => {
        if(err) console.log(err);

        keys.forEach(key => {
            let val = data[key.key];
            if(Object.keys(val).length !== 0) {
                $(key.contentID).text(val);
            }       
        })
    })
}

function SetSetting(key, val) {
    storage.set(key, val);
}

function GetKey(key) {
    let objs = keys.filter(obj => obj.key === key);
    if(objs.length > 0) return objs[0];
    return undefined;
}

function SetContent(key, contentVal, defaultVal) {
    let keyObj = GetKey(key);
    
    if(keyObj) {
        console.log(contentVal, defaultVal, key);
        if(!contentVal && defaultVal) {
            contentVal = defaultVal;
        }
        $(keyObj.contentID).text(contentVal);
    }
}

LoadSettings();

$("#tftp-dir-btn").click(() => {
    $("#tftp-dir").click()
});

$("#tftp-dir").change(() => {
    let dir;
    try {
        dir = $("#tftp-dir")[0].files[0].path;
    } catch (ex) { }
    
    console.log(dir);

    let key = "tftp-directory";
    
    settings[key] = dir;

    SetContent(key, dir, "Select directory...");
    
})

