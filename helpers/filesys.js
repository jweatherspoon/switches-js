/**
 * @file Helper functions for dealing with the file system
 * @author Jonathan Weatherspoon
 * @module filesys
 */

const storage = require('electron-json-storage');
const {settingKeys} = require('./user-settings');
const fs = require('fs');

/**
 * Try to create a new directory. 
 * @param {string} dirPath - Path to the new directory
 * @returns {Promise<any>} Resolves on successful creation or 
 * if the directory exists. Rejects if the directory cannot
 * be created.
 */
exports.CreateDirectory = async (dirPath) => {
    return new Promise((resolve, reject) => {
        // Check if the directory exists
        let exists = fs.existsSync(dirPath);
        if(exists) {
            resolve(true);
        } else {
            fs.mkdir(dirPath, (err) => {
                if(err) {
                    reject(`Failed to create directory ${dirPath}`);
                } else {
                    resolve(true);
                }
            })
        }
    })
}