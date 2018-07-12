/**
 * @file Functions for ensuring the installed code version on the 
 * machine is correct and up to date.
 * @author Jonathan Weatherspoon
 * @module code-version
 */

const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const storage = require('electron-json-storage');
const cheerio = require('cheerio');

const { settingKeys } = require('./user-settings');
const { CreateDirectory } = require('./filesys');

const { CodeVersionUrl } = require('../models/CodeVersionUrl');

const { dialog } = require('electron');
const { ConfigurationWindow } = require('../models/ConfigurationMenu');
const { CodeVersionBrowser } = require('../models/CodeVersionBrowser');

const supportSites = {
    ruckus: new CodeVersionUrl('https://support.ruckuswireless.com', 'product_families/21-ruckus-icx-switches'),
};

let codeVersionAPIs;

/**
 * Guide the user through configuring a TFTP directory
 * @returns {Promise<boolean>} Resolves once the user has closed 
 * the configuration menu
 */
const ConfigureTFTPDirectory = () => {
    return new Promise((resolve, reject) => {
        // Tell the user they need to configure TFTP
        dialog.showMessageBox({
            title: "TFTP Directory Required",
            message: `No TFTP directory has been configured yet. 
            Please configure one now.`,
            type: "error",
            buttons: [
                "OK",
            ],
        }, () => {
            ConfigurationWindow.openWindow({
                'closed': () => {
                    resolve(true)
                }
            });
        })
    });
}

/**
 * Fetch some html and load it into the cheerio parser
 * @async
 * @param {string} url - The URL to fetch HTML from 
 * @returns {Cheerio} A cheerio parser with the HTML loaded
 */
const FetchHtmlAndLoad = async (url) => {
    let html = await fetch(url).then(resp => resp.text());
    return cheerio.load(html);
}

/**
 * Use cheerio to find HTML tags given their inner text
 * @param {Cheerio} $ - A cheerio parser with the HTML loaded
 * @param {string} tag - The type of tag to search for 
 * @param {string} text - The inner text to match against
 * @returns {string[]} A list of elements that matched the 
 * given parameters
 */
const FindElementsByText = ($, tag, text) => {
    let elements = $(tag).filter(function (index) {
        if ($(this).text() === text) {
            return text;
        }
    });

    return elements;
}


/**
 * Get the recommended firmware version for a switch 
 * @async
 * @param {string} url - The url to search
 * @returns {object} - An object containing the recommended
 * code version and a link to the file 
 */
const RuckusCodeVersionAPI = async (url) => {

    // Follow the parsed link and fetch the HTML
    $ = await FetchHtmlAndLoad(url);
    link = FindElementsByText($, 'dt', 'Recommended Firmware:');

    // Make sure a link was retrieved 
    if (link.length < 1) return null;

    // try to get the link to the firmware version
    try {
        let href = link[0].next.next.firstChild.attribs.href;

        // Now that we have the link, find the code version
        let re = /\d+-\d+-\d+\w*/;
        let ver = re.exec(href);

        let data = {
            href: href,
        };

        if (ver) { // Code version successfully found
            data.version = ver[0].replace(/\.|-/g, '');
        }

        return data;
    } catch (ex) {
        return null; // Could not get the firmware version
    }
}

/**
 * Check if a code version exists in a folder
 * @param {string} modelDirectory - The path to the model folder in the TFTP directory
 * @param {string} versionDirectory - Path to the version directory in the model directory
 * @param {string} childDirectory - The path to the child folder in the version directory
 * @param {string} ext - The extension to search for in the directory (default: .bin)
 * @returns {Promise<any>} Resolves to the first found
 * filename if a given code version is found in the folder.
 * Resolves to false if it is not found. Rejects if there is an error.
 */
const CheckFolder = (modelDirectory, versionDirectory, childDirectory, ext=".bin") => {
    return new Promise((resolve, reject) => {
        // Find a binary file inside the Flash directory
        fs.readdir(path.join(modelDirectory, versionDirectory, childDirectory), (err, files) => {
            if (err || !files) {
                reject(err);
                return;
            }
            // Find a file that matches the version number
            let filename = files.find(file => file.includes(ext));
            if (!filename) {
                resolve(false);
            } else {
                resolve(filename);
            }
        })
    })
}

/**
 * Check that the code in a directory matches a version for a given switch model
 * @async
 * @param {string} tftpDirectory - Path to the TFTP directory on the system
 * @param {string} model - The model name of the switch
 * @param {string} version - The code version to match against
 * @returns {any} Resolves to a dictionary containing the 
 * filenames for boot, flash, and poe if boot and flash
 * code exist. Rejects if one or both do not exist.
 */
const CheckCodeExists = async (tftpDirectory, model, version) => {
    let modelDir = path.join(tftpDirectory, model);
    
    try {
        let bootCheck = await CheckFolder(modelDir, version, "Boot");
        let flashCheck = await CheckFolder(modelDir, version, "Flash");

        if(bootCheck && flashCheck) {
            let poeCheck = await CheckFolder(modelDir, version, "Firmware", ".fw");
            return {
                boot: bootCheck,
                flash: flashCheck,
                poe: poeCheck,
            }
        } else {
            return false;
        }
    } catch(err) { 
        throw new Error(err);
    }
}


/**
 * Create the folder hierarchy for a switch in the TFTP directory
 * @async
 * @param {string} tftpDirectory - The path to the configured TFTP directory
 * @param {string} model - The model name of the switch
 * @param {string} version - The version of code
 * @returns {any} Resolves if all directories are created /
 * if they exist. Rejects if it cannot make any of the directories.
 */
const CreateTFTPStructure = async (tftpDirectory, model, version) => {
        let modelPath = path.join(tftpDirectory, model);
        let versionPath = path.join(modelPath, version);
        let bootPath = path.join(versionPath, "Boot");
        let flashPath = path.join(versionPath, "Flash");
        let poePath = path.join(versionPath, "Firmware");

        await CreateDirectory(modelPath);
        await CreateDirectory(versionPath);
        await CreateDirectory(bootPath);
        await CreateDirectory(flashPath);
        await CreateDirectory(poePath);
        return true;
}

/**
 * Guide the user through downloading the new code / adding it
 * to their TFTP directory
 * @param {string} codeURL - The URL for the download link of the new code
 * @returns {Promise<boolean>} Resolves when the browser is closed.
 */
const GetNewCode = (codeURL, model, ver) => {
    return new Promise((resolve, reject) => {
        dialog.showMessageBox({
            title: "Switch Code not Found",
            type: "error",
            message: `
            Switch code version ${ver} was not found in 
            your TFTP directory. Click the OK button to open
            the support site. Please download the recommended
            firmware version and extract it to the Boot, 
            Flash, and Firmware folders in the ${model}/${ver} folder 
            in your TFTP directory. 
            `,
            buttons: [
                "OK",
            ],
        }, () => {
            let brow = new CodeVersionBrowser(model, ver);
            brow.openWindow(codeURL, {
                'closed': () => {
                    return resolve(true);
                }
            });
        })
    });

}

/**
 * Update the code stored in the user's TFTP directory
 * @param {string} model - The model name of the switch
 * @param {string} supportSiteKey - The key for the support site dictionary
 * @returns {Promise<any>} Resolves to true when the code is ready to be uploaded.
 * Resolves to false if a step fails. Rejects if a crash occurs.
 */
const UpdateCodeVersion = async (model, supportSiteKey) => {
    let versionData;
    let codeAPI = codeVersionAPIs[model];
    
    return new Promise((resolve, reject) => {
        storage.get(settingKeys.tftp, async (err, tftpDir) => {
            if (err || Object.keys(tftpDir).length === 0) {
                try {
                    await ConfigureTFTPDirectory();
                    return resolve(false);
                } catch (err) {
                    return reject("Failed to configure TFTP directory");
                }
            } else {
                try {
                    versionData = await codeAPI.api(codeAPI.url.url);
                } catch (err) {
                    return reject(`Failed to fetch data from ${codeAPI.url.url}`);
                }

                try {
                    // Check if the updated code exists in the TFTP directory
                    let codeInTFTP = await CheckCodeExists(tftpDir, model, versionData.version);
                    
                    if(!codeInTFTP) {
                        throw new Error("Code doesn't exist")
                    }

                    return resolve({
                        success: codeInTFTP,
                        version: versionData.version
                    });

                } catch (err) {
                    console.log(err);
                    CreateTFTPStructure(tftpDir, model, versionData.version).then(() => {

                        GetNewCode(codeAPI.url.url, model, versionData.version).then(() => {
                            return resolve(false)
                        }).catch(() => {
                            return reject("Failed to get new code")
                        });
                    }).catch((err) => {
                        return reject(err);
                    })
                }
            }
        })
    })
}

/**
 * Update and upload default flash / boot / PoE (optional) to a switch
 * @async
 * @param {string} model - The model name of the switch
 * @param {string} supportSiteKey - The key for the support site dictionary
 */
const ForceUpdateCode = async (model, supportSiteKey) => {
    try {
        let codeUpdated = await UpdateCodeVersion(model, supportSiteKey);
        if (codeUpdated.success) {
            return codeUpdated
        } else {
            return ForceUpdateCode(model, supportSiteKey);
        }
    } catch(err) {
        throw new Error(err);
    }
}

codeVersionAPIs = {
    'ICX7150': {
        url: new CodeVersionUrl('https://support.ruckuswireless.com', 'products/108-brocade-icx-7150-campus-switches'),
        api: RuckusCodeVersionAPI,
    },
    'ICX7250': {
        url: new CodeVersionUrl('https://support.ruckuswireless.com', 'products/105-brocade-icx-7250-campus-switches'),
        api: RuckusCodeVersionAPI,
    },
    'ICX7450': {
        url: new CodeVersionUrl('https://support.ruckuswireless.com', 'products/106-brocade-icx-7450-campus-switches'),
        api: RuckusCodeVersionAPI,
    },
    'ICX7650': {
        url: new CodeVersionUrl('https://support.ruckuswireless.com', 'products/145-ruckus-icx-7650-campus-switches'),
        api: RuckusCodeVersionAPI,
    },
    'ICX7750': {
        url: new CodeVersionUrl('https://support.ruckuswireless.com', 'products/107-brocade-icx-7750-campus-switches'),
        api: RuckusCodeVersionAPI,
    },
    'ICX6610': {
        url: new CodeVersionUrl('https://support.ruckuswireless.com', 'products/120-brocade-icx-6610-campus-switches'),
        api: RuckusCodeVersionAPI,
    },
    'ICX6430': {
        url: new CodeVersionUrl('https://support.ruckuswireless.com', 'products/121-brocade-icx-6430-and-6450-campus-switches'),
        api: RuckusCodeVersionAPI,
    },
    'ICX6450': {
        url: new CodeVersionUrl('https://support.ruckuswireless.com', 'products/121-brocade-icx-6430-and-6450-campus-switches'),
        api: RuckusCodeVersionAPI,
    },
}

exports.supportSites = supportSites;
exports.codeVersionAPIs = codeVersionAPIs;
exports.ConfigureTFTPDirectory = ConfigureTFTPDirectory;
exports.FetchHtmlAndLoad = FetchHtmlAndLoad;
exports.FindElementsByText = FindElementsByText;
exports.RuckusCodeVersionAPI = RuckusCodeVersionAPI;
exports.CheckFolder = CheckFolder;
exports.CheckCodeExists = CheckCodeExists;
exports.CreateTFTPStructure = CreateTFTPStructure;
exports.GetNewCode = GetNewCode;
exports.UpdateCodeVersion = UpdateCodeVersion;
exports.ForceUpdateCode = ForceUpdateCode;