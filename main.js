const electron = require('electron')
const prompt = require('electron-prompt')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipcMain = electron.ipcMain

const fs = require('fs');
const path = require('path')
const url = require('url')

process.env.NODE_ENV = "production"

ipcMain.on('reqfname', (event, arg) => {
  event.sender.send('sendfname', current_file)
})

ipcMain.on('update', (event, arg) => {
  event.sender.send('update', 'Editing: ' + current_file + '   |   Theme: ' + theme + "   |   Language: " + language + "   |    Text Size: " + text_size)
})

ipcMain.on('save', (event, arg) => {
  this.writeFile(current_file, arg)
})

ipcMain.on('save_as', (event, arg) => {
  this.writeFile(save_as, arg)
})

ipcMain.on('reqfile', (event, arg) => {
  var file = arg
  current_file = file

  var data = this.readFile(file)

  event.sender.send('sendfile', data)
})

ipcMain.on('savefile', (event, arg) => {
  this.writeFile(current_file, arg)
})

let mainWindow
let prefWindow
let save_as
let language = "javascript"
let theme = "monkai"
let current_file = "None"
let text_size = 12

/*function createPrefWindow() {
  if(prefWindow == null) {
    prefWindow = new BrowserWindow(
      {
        width: 800, height: 600
      }
    )

    prefWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'preferences.html'),
      protocol: 'file:',
      slashes: true
    }))

    prefWindow.on('closed', function () {
      prefWindow = null
    })
  }
}*/

function op(title, label, callback) {
  prompt({
      title: title,
      label: label,
      value: '',
      inputAttrs: { // attrs to be set if using 'input'
          type: 'url'
      },
      type: 'input'
  })
  .then((r) => {
    callback(r)
  })
  .catch(console.error)
}

function osp(title, label, selectOptions, callback) {
  prompt({
    title: 'Prompt example',
    label: 'URL:',
    //value: 'http://example.org',
    inputAttrs: { // attrs to be set if using 'input'
        type: 'url'
    },
    type: 'select', // 'select' or 'input, defaults to 'input'
    selectOptions: selectOptions
  })
  .then((r) => {
    callback(r);
  })
  .catch(console.error)
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

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save',
          click() {
            mainWindow.webContents.send( 'save' )
          }
        },
        {
          label: 'Save As',
          click() {
            op("Save As", "File Path:", (r) => {
              save_as = r
              mainWindow.webContents.send( 'save_as' )
            })
          }
        },
        {
          label: 'Open',
          click() {
            op("Open", "File Path:", (r) => {
              current_file = r
              mainWindow.webContents.send( 'open', fs.readFileSync(current_file) )
            })
          }
        }
      ]
    },
    {
      label: "Settings",
      submenu: [
        {
          label: "Text Size",
          click() {
            op("Setting", "Text Size:", (r) => {
              text_size = r
              mainWindow.webContents.send( 'chg_text', r )
            })
          }
        },
        {
          label: "Language Select",
          click() {
            osp("Setting", "Select Language", { // select options if using 'select' type
                'plain': 'Plain Text',
                'ruby': 'Ruby',
                'python': 'Python',
                'java': 'Java',
                'javascript': 'JavaScript',
                'html': 'HTML',
                'c': 'C',
                'c++': 'C++',
                'c#': 'C#',
                'haskell': 'Haskell',
                'golang': 'Go',
                'css': 'CSS',
                'coffeescript': 'CoffeeScript',
                'dart': 'Dart',
                'julia': 'Julia'
            }, (r) => {
              language = r

              if(!(language === 'plain')) {
                mainWindow.webContents.send( 'chg_lang', r )
              } else {
                mainWindow.webContents.send( 'plain' )
              }
            })
          }
        },
        {
          label: "Theme Select",
          click() {
            osp("Setting", "Select Theme", { // select options if using 'select' type
                'ambiance': 'Ambiance',
                'chaos': 'Chaos',
                'chrome': 'Chrome',
                'clouds': 'Clouds',
                'clouds_midnight': 'Clouds Midnight',
                'cobalt': 'Cobalt',
                'crimson_editor': 'Crimson Editor',
                'dawn': 'Dawn',
                'dracula': 'Dracula',
                'dreamweaver': 'Dreamweaver',
                'eclipse': 'Eclipse',
                'github': 'Github',
                'gob': 'Gob',
                'gruvbox': 'Gruvbox',
                'idle_fingers': 'Idle Fingers',
                'iplastic': 'IPlastic',
                'katzenmilch': 'Katzenmilch',
                'kr_theme': 'KrTheme',
                'kuroir': 'Kuroir',
                'merbivore': 'Merbivore',
                'merbivore_soft': 'Merbivore Soft',
                'mono_industrial': 'Mono Industrial',
                'monkai': 'Monkai',
                'pastel_on_dark': 'Pastel Dark',
                'solarized_dark': 'Solarized Dark',
                'solized_light': 'Solarized Light',
                'sqlserver': 'SQLServer',
                'terminal': 'Terminal',
                'textmate': 'Textmate',
                'tomorrow': 'Tomorrow',
                'tomorrow_night': 'Tomorrow Night',
                'tomorrow_night_blue': 'Tomorrow Night Blue',
                'tomorrow_night_bright': 'Tomorrow Night Bright',
                'tomorrow_night_eighties': 'Tomorrow Night 80s',
                'twilight': 'Twilight',
                'vibrant_ink': 'Vibrant Ink',
                'xcode': 'XCode'
            }, (r) => {
              theme = r
              mainWindow.webContents.send( 'chg_theme', r )
            })
          }
        },
        {
          label: "Change Tab Size",
          click() {
            op("Setting", "Change Tab Size", (r) => {
              mainWindow.webContents.send( 'chg_tab', r )
            })
          }
        }
      ]
    }
  ]

  var menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
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
