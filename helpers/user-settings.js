/**
 * @file Stores the keys for all user settings
 * @author Jonathan Weatherspoon
 * @module user-settings
 */

exports.settingKeys = {
    tftp: 'tftp-directory',
    tftpIp: 'tftp-ip',
    tftpNetmask: 'tftp-netmask',
    managementVlan: 'management-vlan',
    firstStart: 'first-start',
};

/**
 * Check if something is the empty object
 * @param {any} val - The value to check against the empty object
 */
const IsEmpty = (val) => {
    return Object.keys(val).length === 0;
}

/**
 * Get the user configured TFTP directory path
 * @returns {Promise<any>} Resolves to the path of the TFTP directory if 
 * found, or rejects with a message if not.
 */
exports.GetTFTPDir = () => {
    return new Promise((resolve, reject) => {
        storage.get(settingKeys.tftp, (err, tftp) => {
            if(err || IsEmpty(tftp)) {
                return reject("Failed to get configured TFTP directory");
            }
            return resolve(tftp);
        })
    })
}

/**
 * Get the user configured TFTP server IP address
 * @returns {Promise<any>} Resolves to the server's IP address if found,
 * or rejects with a reason if it wasn't.
 */
exports.GetTFTPServerIP = () => {
    return new Promise((resolve, reject) => {
        storage.get(settingKeys.tftpIp, (err, serverIP) => {
            if(err || IsEmpty(serverIP)) {
                return reject("Failed to get configured TFTP server IP");
            }
            return resolve(serverIP);
        })
    })
}

/**
 * Get the user configured TFTP server subnet mask
 * @returns {Promise<any>} Resolves to the server's subnet mask if found, or
 * rejects with a reason if not found.
 */
exports.GetTFTPNetmask = () => {
    return new Promise((resolve, reject) => {
        storage.get(settingKeys.tftpNetmask, (err, netmask) => {
            if(err || IsEmpty(netmask)) {
                return reject("Failed to get configured TFTP server netmask");
            }

            return resolve(netmask);
        })
    })
}

/**
 * Get a dictionary containing all settings pertaining to TFTP
 * @async
 * @returns {object} Contains the TFTP directory, server ip, and 
 * server subnet mask
 */
exports.GetTFTPSettings = async () => {
    let dir = await GetTFTPDir();
    let ip = await GetTFTPServerIP();
    let mask = await GetTFTPNetmask();

    return {
        directory: dir,
        serverIP: ip,
        netmask: mask
    };
}

/**
 * Try to get the user configured management vlan
 * @returns {Promise<any>} Resolves to the configured VLAN if found
 * or rejects with a message if not.
 */
exports.GetManagementVLAN = () => {
    return new Promise((resolve, reject) => {
        storage.get(settingKeys.managementVlan, (err, vlan) => {
            if(err || IsEmpty(vlan)) {
                return reject("Failed to get configured management VLAN");
            }
            return resolve(vlan);
        })
    })
}