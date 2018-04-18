var fs = require('fs')

module.exports.init = () => {
  fs.readdirSync('./plugins').forEach(file => {
    console.log(plugin)

    eval(plugin)
  })
}
