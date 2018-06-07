const $ = require('jquery');
const storage = require('electron-json-storage');

let settings = {};

const keys = [
    {
        key: "tftp-directory",
        contentID: "#tftp-dir-text"
    }
];

/**
 * Load the user's preferences and display them
 */
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

/**
 * Save a persistent user setting
 * @param {string} key - The key to save
 * @param {string} val - The value of that key
 */
async function SetSetting(key, val) {
    return await storage.set(key, val);
}

/**
 * Save all settings that the user changed 
 */
async function SaveSettings() {
    let count = 0;
    
    for(let key in settings) {
        await SetSetting(key, settings[key]);
        count ++;
    }

    return count;
}

/**
 * Get a persistent user setting
 * @param {string} key - The key to get
 */
function GetKey(key) {
    let objs = keys.filter(obj => obj.key === key);
    if(objs.length > 0) return objs[0];
    return undefined;
}

/**
 * 
 * @param {string} key - The key to get
 * @param {string} contentVal - The content to display if a setting exists
 * @param {string} defaultVal - The content to display if the previous doesn't
 */
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

$("#config-save").click(e => {
    // Save each setting to persistent storage
    SaveSettings().then(count => {
        if(count == Object.keys(settings).length) {
            window.close();
        }
    })
});

$(document).ready(() => {
    LoadSettings();
});