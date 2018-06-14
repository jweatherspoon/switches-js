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