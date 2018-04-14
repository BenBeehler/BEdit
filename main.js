const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipcMain = electron.ipcMain;

const fs = require('fs');
const path = require('path')
const url = require('url')

ipcMain.on('openpref', (event, arg) => {
  createPrefWindow()
})

ipcMain.on('reqfile', (event, arg) => {
  var file = arg
  this.file = file

  var data = this.readFile(file)

  event.sender.send('sendfile', data)
})

ipcMain.on('savefile', (event, arg) => {
  this.writeFile(this.file, arg)
})

let mainWindow
let prefWindow

function createPrefWindow() {
  if(prefWindow == null) {
    prefWindow = new BrowserWindow(
      {
        width: 800, height: 600
      }
    )

    prefWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    prefWindow.on('closed', function () {
      prefWindow = null
    })
  }
}

function createWindow() {
  mainWindow = new BrowserWindow(
    {
      width: 1920, height: 1080
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

module.exports.readFile = (file) => {
  return fs.readFileSync(file)
}

module.exports.writeFile = (file, data) => {
  fs.writeFile(file, data, function(err) {
      if(err) {
          return console.log(err)
      }
  })
}

module.exports.file = ""
