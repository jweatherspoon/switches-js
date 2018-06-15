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
 * @returns {object[]} Electron menu template
 */
exports.GenerateTemplate = (configWindow) => {
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
            label: 'Developer Tools',
            submenu: [
                { role: 'toggledevtools' },
                { role: 'reload' }
            ]
        }
    ];
}