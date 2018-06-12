const $ = require('jquery');
const storage = require('electron-json-storage');
const { settingKeys } = require('../../models/helpers/user-settings');

const keys = [
    {
        key: settingKeys.tftp,
        contentID: "#tftp-dir-text"
    },
    {
        key: settingKeys.managementVlan,
        contentID: "#management-vlan"
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
                $(key.contentID).val(val);
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
 * @param {object} settings - A JavaScript object that 
 * contains setting keys and values
 */
async function SaveSettings(settings) {
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

function GetContent(contentID) {
    let val;
    if($(contentID)[0].tagName === "INPUT") {
        val = $(contentID).val();
    } else {
        val = $(contentID).text();
    }

    return val;
}

$("#tftp-dir-btn").click(() => {
    $("#tftp-dir").click()
});

$("#tftp-dir").change(e => {
    let dir;
    try {
        dir = $("#tftp-dir")[0].files[0].path;
    } catch (ex) { }
    let key = "tftp-directory";
    SetContent(key, dir, "Select directory...");
    
})

$("#config-save").click(e => {
    let settings = {};
    keys.forEach(keyObj => {
        let val = GetContent(keyObj.contentID);
        if(val) {
            settings[keyObj.key] = val;
        }
    });

    console.log(settings);

    // Save each setting to persistent storage
    SaveSettings(settings).then(count => {
        if(count == Object.keys(settings).length) {
            window.close();
        }
    })
});

$(document).ready(() => {
    LoadSettings();
});