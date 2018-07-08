let loadingInterval, loadingIndex;

/**
 * Navigate to the next page in the application flow
 */
function NextPage() {
    $(document.body).load('./SwitchStack.html');
}

/**
 * Set the size of a dot with an id of dot-<number>
 * @param {number} idNum - The id number for the dot in 
 * the loading ellipse (#dot-{idNum}) 
 * @param {number} size - The size to give to the dot in ems.
 */
const SetDotSize = (idNum, size) => {
    $(`#dot-${idNum}`).css({
        fontSize: `${size}em`
    })
}

const SetLoadingEllipse = () => {
    for (let i = 0; i < 3; i++) {
        let size = (i === loadingIndex) ? 5 : 3;
        SetDotSize(i, size);
    }
    loadingIndex = (loadingIndex + 1) % 3;
}

/**
 * Begin the process of updating the code stored on the 
 * user's machine
 */
$(document).ready(e => {

    loadingIndex = 0;

    SetLoadingEllipse();
    loadingInterval = setInterval(() => {
        SetLoadingEllipse();
    }, 400);

    ipcRenderer.send("code:update", {
        model: switchmodel,
    });
});

/**
 * Display a success message to the user and navigate to 
 * the next page in the application flow
 */
ipcRenderer.on("code:updated", async (event, arg) => {
    $("#loading-container").fadeOut(100);
    await wait(100);
    $("#finished-container").fadeIn(100);
    await wait(350);
    NextPage();
})