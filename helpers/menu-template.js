/**
 * @file Helper function for generating a template to build
 * out an application menu
 * @author Jonathan Weatherspoon
 * @module menu-template
 */

/**
 * Generate a template for an application menu
 * @param {ConfigurationWindow} configWindow - A handle to the 
 * ConfigurationWindow that will be opened when the 
 * "Show Configuration Menu" button is pressed.
 * @param {WipingModeWindow} wipeWindow - A handle to the 
 * WipingModeWindow that will be opened when the 
 * "Enter Wiping Mode" button is pressed.
 * @returns {object[]} Electron menu template
 */
exports.GenerateTemplate = (configWindow, wipeWindow) => {
    return [
        {
            label: 'Configure',
            submenu: [
                {
                    label: 'Show Configuration Menu',
                    click: () => {
                        configWindow.openWindow()
                    },
                }, {
                    type: 'separator'
                },
            ]
        },
        {
            label: 'Wipe',
            submenu: [
                {
                    label: 'Enter Wiping Mode',
                    click: () => {
                        wipeWindow.openWindow();
                    }
                },
                {
                    type: 'separator',
                }
            ]
        },
        {
            label: 'Developer Tools',
            submenu: [
                { role: 'toggledevtools' },
                { role: 'reload' }
            ]
        }
    ];
}