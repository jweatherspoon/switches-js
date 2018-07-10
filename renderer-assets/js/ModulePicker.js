/**
 * @file Code for controlling the Module Picker page
 * @author Jonathan Weatherspoon
 */

function CreateModuleElement(mod, index) {
    let container = document.createElement('div');
    container.classList = [
        "flex",
        "flex-justify-space-around",
        "flex-row"
    ]

    let moduleName = document.createElement('span');
    moduleName.innerText = `Module ${index}`;

    let moduleBtn = document.createElement('button');
    moduleBtn.innerText = "Configure";
    moduleBtn.onclick = () => {
        $(document.body).load(`./${mod.GUI}`);
        mod.configured = true;
    }

    container.appendChild(moduleName);
    container.appendChild(moduleBtn);

    return container;
}

function PopulateModules() {
    if(!switchStack) {
        throw new Error("No switch stack has been defined");
    }

    let root = document.getElementById("module-root");

    switchStack.switches[0].modules.forEach((mod, index) => {
        let moduleElement = CreateModuleElement(mod, index + 1);
        root.appendChild(moduleElement);
    })
}

$(document).ready(e => {
    PopulateModules();
})