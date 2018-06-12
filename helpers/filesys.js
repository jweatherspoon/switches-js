const storage = require('electron-json-storage');
const {settingKeys} = require('./user-settings');
const fs = require('fs');

/**
 * Get a list of files in the TFTP directory and perform a 
 * callback on the list returned
 * @param {string} search - A pattern to search for (can be regex)
 * @param {function} callback - Callback function that gets passed
 * search and a list of files in the directory
 */
exports.GetTFTPDirectoryContents = async (search, callback) => {
    storage.get(settingKeys.tftp, (err, dirname) => {
        if(err || !dirname) {
            throw new Error("No TFTP directory configured!");
        }
    
        let files = fs.readdirSync(dirname);
        callback(search, files);
    });
}

/**
 * Get a list of directories in a base path 
 * @param {string} basepath - The directory to search
 * @param {function} callback - Callback function that is
 * passed a list of directories found in basepath
 */
exports.GetDirs = async (basepath, callback) => {
    fs.readdir(basepath, (err, files) => {
        // Filter the directories
        let dirs = files.filter(file => {
            return fs.statSync(path.join(basepath, file)).isDirectory();
        })
        callback(dirs);
    })
}