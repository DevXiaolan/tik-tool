const fs = require('fs')
const path = require('path')
const rightPad = require('rightpad')
const colors = require('colors')

const healthRouter = require('koa-router')()
healthRouter.get('/ping', (ctx) => {
  return ctx.success({})
})

const colorMap = {
  'HEAD,GET': colors.green,
  'POST': colors.blue,
  'DELETE': colors.red,
  'PUT': colors.yellow
}


module.exports = (app) => {
  /* eslint-disable */
  const basePath = path.resolve(`${__dirname}/../src`)

  if (fs.existsSync(`${basePath}/error.js`)) {
    global.error = require(`${basePath}/error`)
  }

  console.log('============ROUTER============')
  app.use(healthRouter.routes(), healthRouter.allowedMethods())
  console.log(`${rightPad(colorMap['HEAD,GET']('HEAD,GET'), 24)}${rightPad(`/ping`, 32)}`)

  const router = require(`${basePath}/router.js`)
  router.stack.forEach(item => {
    const method = item.methods.join(',')
    console.log(`${rightPad(colorMap[method](method), 24)}${rightPad(`${item.path || item.opts.prefix}`, 32)}`)
  })
  app.use(router.routes(), router.allowedMethods())

  console.log('==============================')
  /* eslint-enable */
}