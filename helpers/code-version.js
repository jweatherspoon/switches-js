const fetch = require('fetch');
const fs = require('fs');
const storage = require('electron-json-storage');
const cheerio = require('cheerio');
const { settingKeys } = require('./user-settings');
const { CreateDirectory } = require('./filesys');
const { dialog } = require('electron');
const { ConfigurationMenu } = require('../models/ConfigurationMenu');

/**
 * Guide the user through configuring a TFTP directory
 * @returns {Promise} Resolves once the user has closed 
 * the configuration menu
 */
const ConfigureTFTPDirectory = async () => {
    return new Promise((resolve, reject) => {
        // Tell the user they need to configure TFTP
        dialog.showMessageBox({
            title: "TFTP Directory Required",
            message: `No TFTP directory has been configured yet. 
            Please configure one now.`,
            type: "error",
            buttons: [
                "OK",
            ]
        }, () => {
            // Open the configuration menu and resolve when closed
            ConfigurationMenu.openWindow();
            ConfigurationMenu.addHandler('closed', () => {
                resolve(true);
            })
        })
    });
}

/**
 * Fetch some html and load it into the cheerio parser
 * @param {string} url - The URL to fetch HTML from 
 * @returns {Cheerio} A cheerio parser with the HTML loaded
 */
FetchHtmlAndLoad = async (url) => {
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
FindElementsByText = ($, tag, text) => {
    let elements = $(tag).filter(function (index) {
        if ($(this).text() === text) {
            return text;
        }
    });

    return elements;
}


/**
 * Get the recommended firmware version for a switch 
 * @param {string} model - The model name of the switch 
 * @param {string} url - The url to search
 * @returns {object} - An object containing the recommended
 * code version and a link to the file 
 */
const GetRecommendedCodeVersion = async (model, url) => {
    // let html = await fetch(url).then(resp => resp.text());
    // let $ = cheerio.load(html);

    let $ = await FetchHtmlAndLoad(url);

    // Search for the model name 
    let link = FindElementsByText($, 'a', model);

    console.log("First Link:", link.length);

    // Make sure a link was retrieved. If not return null
    if (link.length < 1) return null;
    // Get the href from the parsed element
    link = link[0].attribs.href;


    // Follow the parsed link and fetch the HTML
    $ = await FetchHtmlAndLoad(link);
    link = FindElementsByText($, 'dt', 'Recommended Firmware:');

    // Make sure a link was retrieved 
    if (link.length < 1) return null;

    // try to get the link to the firmware version
    try {
        let href = link[0].next.next.firstChild.attribs.href;

        console.log("Second link:", JSON.stringify(href));

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
 * Check the boot folder in a given directory for a code version
 * @param {string} modelDirectory - The path to the model directory
 * @param {string} version - The string that stores the version data
 */
const CheckBootFolder = async (modelDirectory, version) => {
    return new Promise((resolve, reject) => {
        // Find a binary file inside the BOOT directory
        fs.readdir(path.join(modelDirectory, "BOOT"), (err, files) => {
            if (err || !files || files.length === 0) {
                reject(false);
            }
            // Find a file that matches the version number
            let found = files.find(file => file.includes(version));
            if (!found) {
                reject(false);
            } else {
                resolve(true);
            }
        })
    })
}

/**
 * Check the flash folder in a given directory for a code version
 * @param {string} modelDirectory - The path to the model directory
 * @param {string} version - The string that stores the version data
 */
const CheckFlashFolder = async (modelDirectory, version) => {
    return new Promise((resolve, reject) => {
        // Find a binary file inside the FLASH directory
        fs.readdir(path.join(modelDirectory, "FLASH"), (err, files) => {
            if (err || !files || files.length === 0) {
                reject(false);
            }
            // Find a file that matches the version number
            let found = files.find(file => file.includes(version));
            if (!found) {
                reject(false);
            } else {
                resolve(true);
            }
        })
    })
}

/**
 * Check that the code in a directory matches a version for a given switch model
 * @param {string} tftpDirectory - Path to the TFTP directory on the system
 * @param {string} model - The model name of the switch
 * @param {string} version - The code version to match against
 */
const CheckCodeExists = async (tftpDirectory, model, version) => {
    return new Promise((resolve, reject) => {
        // Read TFTP directory
        fs.readdir(tftpDirectory, (err, files) => {
            // Find a list of directories in tftpDir
            let dirs = files.filter(file => {
                fs.statSync(path.join(tftpDirectory, file)).isDirectory();
            })

            let modelDirExists = dirs.find(dir => dir === model);

            // Check BOOT / FLASH for version
            if(modelDirExists) {
                let modelDir = path.join(tftpDirectory, model);

                let bootCheck = await CheckBootFolder(modelDir, version);
                let flashCheck = await CheckFlashFolder(modelDir, version);

                if(bootCheck && flashCheck) {
                    resolve(true);
                } else {
                    reject(false);
                }
            }
        })

        // Code was not found in the folder
        reject(false);

    })
}


/**
 * Create the folder hierarchy for a switch in the TFTP directory
 * @param {string} tftpDirectory - The path to the configured TFTP directory
 * @param {string} model - The model name of the switch
 */
exports.CreateTFTPStructure = async (tftpDirectory, model) => {
    return new Promise((resolve, reject) => {
        let bootPath = path.join(tftpDirectory, model, "BOOT");
        let flashPath = path.join(tftpDirectory, model, "FLASH");
        let poePath = path.join(tftpDirectory, model, "POE");

        CreateDirectory(bootPath).then(() => {
            CreateDirectory(flashPath).then(() => {
                CreateDirectory(poePath).then(() => {
                    resolve();
                }).catch(err => reject());
            }).catch(err => reject());
        }).catch(err => reject());
    });
}

/**
 * Guide the user through downloading the new code / adding it
 * to their TFTP directory
 * @param {string} codeURL - The URL for the download link of the new code
 */
const GetNewCode = async (codeURL) => {
    console.log("browser boiiii");
}

/**
 * Update the code stored in the user's TFTP directory
 * @param {string} model - The model name of the switch
 * @param {string} supportSiteKey - The key for the support site dictionary
 */
const UpdateCodeVersion = async (model, supportSiteKey) => {
    let codeUpdated;
    let versionData;

    while(!codeUpdated) {
        storage.get(settingKeys.tftp, (err, tftpDir) => {
            if(err || !tftpDir) {
                await ConfigureTFTPDirectory();
            } else {
                versionData = versionData || await GetCodeVersion(model, supportSiteKeys[supportSiteKey]);
        
                if (!versionData) {
                    throw new Error(
                        `Failed to retrive data from ${supportSiteKeys[supportSiteKey].url}!`
                    )
                }
        
                // Check if the updated code exists in the TFTP directory
                let codeInTFTP = await CheckCodeExists(tftpDir, model, versionData.version);
                
                if(!codeInTFTP) {
                    CreateTFTPStructure(model).then(() => {
                        GetNewCode(supportSiteKeys[supportSiteKey]);
                    }).catch();
                } else {
                    codeUpdated = true;
                }
            }
        })
    }

    return codeUpdated;
}

const UploadDefaultConfig = async (model) => {

}

/**
 * Update and upload default flash / boot / PoE (optional) to a switch
 * @param {string} model - The model name of the switch
 * @param {string} supportSiteKey - The key for the support site dictionary
 */
exports.SwitchDefaultConfig = async (model, supportSiteKey) => {
    let codeUpdated = await UpdateCodeVersion(model, supportSiteKey);
    if(codeUpdated) {
        await UpdateCodeVersion(model);
    }
}

