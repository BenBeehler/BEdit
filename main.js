const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipcMain = electron.ipcMain;

const fs = require('fs');
const path = require('path')
const url = require('url')

let mainWindow
const file = "./test.js";

function createWindow () {
  mainWindow = new BrowserWindow(
    {
      width: 800, height: 600
    }
  )

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

ipcMain.on('save_file', (event, arg) => {
  var data = arg;

  writeFile(file, data);
})

app.on('ready', () => {
  createWindow()
  Menu.setApplicationMenu(null)
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

function writeFile(file, data) {
  fs.writeFile(file, data, function(err) {
      if(err) {
          return console.log(err);
      }
  }); 
}