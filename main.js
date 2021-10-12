const {app, BrowserWindow} = require('electron')

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true
    })

    win.loadFile(__dirname + '/renderer/index.html')

    win.addListener('ready-to-show', () => {
        win.show()
    })
}

app.whenReady().then(
    () => {  createWindow()}
    )

app.addListener('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})