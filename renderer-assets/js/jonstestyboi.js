const $ = require('jquery');
const path = require('path');

const { 
    ipcRenderer,
    remote,
} = require('electron');


const { supportSites } = require('../../helpers/serial');

const {
    ConfigureTFTPDirectory,
    FetchHtmlAndLoad,
    FindElementsByText,
    GetRecommendedCodeVersion,
    CheckBootFolder,
    CheckFlashFolder,
    CheckCodeExists,
    CreateTFTPStructure,
    GetNewCode,
    UpdateCodeVersion,
    SwitchDefaultConfig,
} = require('../../helpers/code-version');

const model = "ICX 7150";
const tftpDir = "/home/jon/tftptest";
const modelDir = path.join(tftpDir, model);
const version = "08061b";

const functionTests = [
    {
        function: ConfigureTFTPDirectory,
        name: "ConfigureTFTPDirectory",
        args: [

        ],
    },
    {
        function: FetchHtmlAndLoad,
        name: "FetchHtmlAndLoad",
        args: [
            "http://google.com",
        ],
    },
    {
        function: FindElementsByText,
        name: "FindElementsByText",
        args: [

        ],
    },
    {
        function: GetRecommendedCodeVersion,
        name: "GetRecommendedCodeVersion",
        args: [
            model,
            supportSites.ruckus.url,
        ],
    },
    {
        function: CheckBootFolder,
        name: "CheckBootFolder",
        args: [
            modelDir, 
            version,
        ],
    },
    {
        function: CheckFlashFolder,
        name: "CheckFlashFolder",
        args: [
            modelDir,
            version,
        ],
    },
    {
        function: CheckCodeExists,
        name: "CheckCodeExists",
        args: [
            tftpDir,
            model,
            version,
        ],
    },
    {
        function: CreateTFTPStructure,
        name: "CreateTFTPStructure",
        args: [
            tftpDir,
            model,
        ],
    },
    {
        function: GetNewCode,
        name: "GetNewCode",
        args: [
            supportSites.ruckus,
        ],
    },
    {
        function: UpdateCodeVersion,
        name: "UpdateCodeVersion",
        args: [
            model,
            "ruckus",
        ],
    },
    {
        function: SwitchDefaultConfig,
        name: "SwitchDefaultConfig",
        args: [
            model,
            "ruckus",
        ],
    },
];

//#region Test Functions
const TestConfigureTFTPDirectory = async () => {
    ConfigureTFTPDirectory().then(val => {
        console.log(val);
    })
}

const TestFetchHtmlAndLoad = async (url) => {
    let cheerio = await FetchHtmlAndLoad(url);
    console.log(cheerio);
}

const TestFindElementsByText = async ($, tag, text) => {
    let cheerio = await FetchHtmlAndLoad("http://google.com");
    let ele = await FindElementsByText(cheerio, 'a', 'About');
    console.log(ele);
    console.log(ele.attribs);
}

const TestGetRecommendedCodeVersion = async (model, url) => {
    let data = await GetRecommendedCodeVersion(model, url);
    console.log(data);
}

const TestCheckBootFolder = async (modelDir, ver) => {

}

const TestCheckFlashFolder = async (modelDir, ver) => {

}

const TestCheckCodeExists = async (tftpDir, model, ver) => {

}

const TestCreateTFTPStructure = async (tftpDir, model) => {

}

const TestGetNewCode = async (codeURL) => {

}

const TestUpdateCodeVersion = async (model, supportSiteKey) => {

}

const TestSwitchDefaultConfig = async (model, supportSiteKey) => {

}
//#endregion

function MakeButton(funcName, args) {
    let html = `
    <button onclick='Test${funcName}(...${JSON.stringify(args)})'>Test ${funcName}</button>
    `;
    return html;
}

$(document).ready(() => {
    functionTests.forEach(test => {
        let html = MakeButton(test.name, test.args);
        document.body.innerHTML += html;
    });

    // Open developer tools 
    remote.getCurrentWebContents().openDevTools();
})