const $ = require('jquery');
const storage = require('electron-json-storage');
const { settingKeys } = require('../../helpers/user-settings');

const { dialog } = require('electron').remote;

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
            try {
                let val = data[key.key];
                if(Object.keys(val).length !== 0) {
                    $(key.contentID).text(val);
                    $(key.contentID).val(val);
                }       
            } catch(err) { /* Skip this key */ }
        })
    })
}

/**
 * Save a persistent user setting
 * @param {string} key - The key to save
 * @param {string} val - The value of that key
 */
async function SetSetting(key, val) {
    return new Promise((resolve, reject) => {
        storage.set(key, val, (err) => {
            if(err) {
                return reject(err);
            } else {
                return resolve(1);
            }
        })
    })
}

/**
 * Save all settings that the user changed 
 * @param {object} settings - A JavaScript object that 
 * contains setting keys and values
 */
async function SaveSettings(settings) {
    return new Promise(async (resolve, reject) => {
        let count = 0;

        for(let key in settings) {
            count += await SetSetting(key, settings[key]);
        }

        return resolve(count);
    })
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

/**
 * Get the content in an element with a given ID
 * @param {string} contentID - Get the content stored in contentID
 * @returns {string} The content associated with the given ID
 */
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

$("#config-save").click(async e => {
    let settings = {};
    keys.forEach(keyObj => {
        let val = GetContent(keyObj.contentID);
        if(val) {
            settings[keyObj.key] = val;
        }
    });

    console.log(settings);

    // Save each setting to persistent storage
    SaveSettings(settings).then(result => {
        window.close();
    })
});

// Load user settings on page load
$(document).ready(() => {
    LoadSettings();
});