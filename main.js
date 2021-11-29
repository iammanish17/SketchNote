const { app, BrowserWindow } = require('electron')
let win = null;
const lock = app.requestSingleInstanceLock();
    
if (!lock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 610,
        icon: __dirname + '/icon.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true,
        resizable: true,
        show: false
    })
    splash = new BrowserWindow({ width: 600, height: 350, frame: false, transparent: true, alwaysOnTop: true, icon: __dirname + '/icon.png' })
    splash.loadFile(__dirname + '/renderer/splash.html')
    win.loadFile(__dirname + '/renderer/index.html')

    win.addListener('ready-to-show', () => {
        splash.destroy();
        win.show()
        win.removeMenu()
    })
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.addListener('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})