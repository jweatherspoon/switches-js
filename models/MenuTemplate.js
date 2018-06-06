let template = [
    {
        label: 'Configure',
        submenu: [
            {
                label: 'Fucka you monkey',
                click: () => {
                    // TODO
                }
            }, {
                type: 'separator'
            }, 
        ]
    },
    {
        label: 'Developer Tools',
        submenu: [
            { role: 'toggledevtools' },
        ]
    }
];

console.log(JSON.stringify(template));

exports.template = template;