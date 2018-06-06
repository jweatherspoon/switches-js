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
    }
];

// Add dev tools support for development environments
if(process.env.ELECTRON_ENV === 'development') {
    template.push({
        label: 'Developer Tools',
        submenu: [
            {role: 'toggledevtools'},
        ]
    })
}

console.log(JSON.stringify(template));

exports.template = template;