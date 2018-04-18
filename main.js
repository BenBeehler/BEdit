const electron = require('electron')
const prompt = require('electron-prompt')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipcMain = electron.ipcMain

const shell = electron.shell

const fs = require('fs');
const path = require('path')
const url = require('url')

let mainWindow
let prefWindow
let save_as
let language = "plain"
let theme = "monkai"
let current_file = "None"
let text_size = 12
let storage = "./storage/settings.json"

process.env.NODE_ENV = "production"

function writeFile(file, data) {
  fs.writeFile(file, data, function(err) {
      if(err) {
          return console.log(err)
      }
  })
}

ipcMain.on('reqfname', (event, arg) => {
  event.sender.send('sendfname', current_file)
})

ipcMain.on('init', (event, arg) => {
    var json = getStorage()
    
    var theme = json.theme
    var language = json.language
    var tabsize = parseInt(json.tabsize)
    
    setLanguage(language)
    setTheme(theme)
    setTabSize(tabsize)
    
	 setTimeout(() => {
	  if(process.argv.length >= 4) {
  		var fName = process.argv[3]
  		/*var fData = fs.readFileSync(fName, "utf8")
  		
  		current_file = fName
  		
  		event.sender.send('open', fData )*/
  		openFile(fName)
	  }
  }, 100)
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
    title: title,
    label: label,
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
      width: 1280, height: 720
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
              mainWindow.webContents.send('save_as')
            })
          }
        },
        {
          label: 'Open',
          click() {
            op("Open", "File Path:", (r) => {
              current_file = r
              openFile(current_file)
            })
          }
        },
        {
          label: "New Window",
          click() {
            shell.openItem("script.bat")
          }
        },
        {
          label: 'Win-CLI',
          click() {
             shell.openItem('cmd.exe')
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
              mainWindow.webContents.send('chg_text', r )
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
              if(!(r == 'undefined' || r == null)) { 
                language = r
                
                var json = getStorage()
                
                json.language = language
                setStorage(json)
  
                if(!(language === 'plain')) {
                  mainWindow.webContents.send('chg_lang', r)
                } else {
                  mainWindow.webContents.send('plain')
                }
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
                'monokai': 'Monokai',
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
              if(!(r == 'undefined' || r == null)) { 
                theme = r
                mainWindow.webContents.send('chg_theme', r )
                var json = getStorage()
                
                json.theme = theme
                setStorage(json)
              }
            })
          }
        },
        {
          label: "Change Tab Size",
          click() {
            op("Setting", "Change Tab Size", (r) => {
              mainWindow.webContents.send('chg_tab', r )
                var json = getStorage()
                
                json.tabsize = r
                setStorage(json)
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

function setLanguage(lang) {
  mainWindow.webContents.send('chg_lang', lang)
}

function setTheme(theme) {
  mainWindow.webContents.send('chg_theme', theme)
}

function setTabSize(size) {
  mainWindow.webContents.send('chg_tab', size)
}

function getStorage() {
    return JSON.parse(fs.readFileSync(storage, "utf8"))
}

function setStorage(json) {
    writeFile(storage, JSON.stringify(json))
}

function ext(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

function openFile(path) {
  var fData = fs.readFileSync(path, "utf8")
	current_file = path
	
	var ex = ext(current_file)
	
	if(ex == 'js') {
	  setLanguage('javascript')
	} else if(ex == 'html') {
	  setLanguage('html') 
	}
	
	mainWindow.webContents.send('open', fData)
}

module.exports.readFile = (file) => {
  return fs.readFileSync(file, "utf8")
}

module.exports.writeFile = (file, data) => {
  fs.writeFile(file, data, function(err) {
      if(err) {
          return console.log(err)
      }
  })
}
