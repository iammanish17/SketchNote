const {app, BrowserWindow} = require('electron')

function createWindow() {
    var win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true,
        resizable: true
    })
    win.loadFile(__dirname + '/renderer/index.html')

    win.addListener('ready-to-show', () => {
        win.show()
    })
}

app.whenReady().then(() => {  
    createWindow()
    app.on('activate', () => {    
        if (BrowserWindow.getAllWindows().length === 0) 
        {      
            createWindow()    
        }  
    })
})

app.addListener('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})