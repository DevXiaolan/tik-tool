const fs = require('fs')
const path = require('path')
const rightPad = require('rightpad')
const colors = require('colors')

const colorMap = {
  'HEAD,GET': colors.green,
  'POST': colors.blue,
  'DELETE': colors.red,
  'PUT': colors.yellow
}

module.exports = (app) => {
  //scan all
  let basePath = path.resolve(`${__dirname}`)
  let modules = fs.readdirSync(basePath)
  console.log('============ROUTER============')
  modules.forEach((m) => {
    if (!fs.statSync(`${basePath}/${m}`).isDirectory()) {
      return
    }
    let versions = fs.readdirSync(`${basePath}/${m}`)
    versions.forEach((v) => {
      if (!fs.statSync(`${basePath}/${m}`).isDirectory()) {
        return
      }
      let router = require(`${basePath}/${m}/${v}/router.js`)
      router.stack.forEach(item => {
        let method = item.methods.join(',')
        console.log(`${rightPad(colorMap[method](method), 24)}${rightPad(`${item.path || item.opts.prefix}`, 32)}`)
      })
      app.use(router.routes(), router.allowedMethods())
    })
  })
  console.log('==============================')
}