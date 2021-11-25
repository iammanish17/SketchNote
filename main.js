const {app, BrowserWindow} = require('electron')

function createWindow() {
    var win = new BrowserWindow({
        width: 800,
        height: 610,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true,
        resizable: true,
        show: false
    })
    splash = new BrowserWindow({width: 600, height: 350, frame: false, transparent: true, alwaysOnTop: true})
    splash.loadFile(__dirname + '/renderer/splash.html')
    win.loadFile(__dirname + '/renderer/index.html')

    win.addListener('ready-to-show', () => {
        splash.destroy();
        win.show()
        //win.removeMenu()
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