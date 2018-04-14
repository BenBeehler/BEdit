// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer

var content = undefined

module.exports.requestFile = () => {
  ipcRenderer.send('reqfile', './test.js')
}

module.exports.openPref = () => {
  ipcRenderer.send('openpref', '')
}

module.exports.saveFile = (content) => {
  ipcRenderer.send('savefile', content)
}

//ipcRenderer.send('asynchronous-message', 'ping')
