const fs = require('fs');
const storage = require('electron-json-storage');
const {settingKeys} = require('./user-settings');

exports.GetTFTPDirectoryContents = async () => {
    let dirName = storage.get(settingKeys.tftp);

    if(!dirName) {
        throw new Error("No TFTP directory configured!");
    }

    let files = await fs.readdir(dirName);
    return files;
}