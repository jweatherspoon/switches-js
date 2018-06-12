const { ConfigurationWindow } = require('./ConfigurationMenu');

let template = [
    {
        label: 'Configure',
        submenu: [
            {
                label: 'Show Configuration Menu',
                click: () => {
                    ConfigurationWindow.openWindow()
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

exports.template = template;