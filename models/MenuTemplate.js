const { ConfigurationWindow } = require('../models/ConfigurationMenu');

const config = new ConfigurationWindow();

let template = [
    {
        label: 'Configure',
        submenu: [
            {
                label: 'Show Configuration Menu',
                click: () => config.openWindow(),
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

exports.template = template;