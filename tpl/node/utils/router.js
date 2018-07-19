const fs = require('fs')
const path = require('path')
const rightPad = require('rightpad')
const colors = require('colors')
const { EOL } = require('os')
const tikConf = require('../tik.json')

const healthRouter = require('koa-router')()
healthRouter.get('/:version/ping', (ctx) => {
  return ctx.success(tikConf)
})
healthRouter.get('/:version/swagger', async (ctx) => {
  if (fs.existsSync(path.resolve(`${__dirname}/../swagger.json`))) {
    ctx.body = require('../swagger.json')
  } else {
    return ctx.success('swagger.json not found')
  }
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

  app.use(healthRouter.routes(), healthRouter.allowedMethods())

  const router = require(`${basePath}/router.js`)
  router.prefix(`/:version`)
  
  app.use(router.routes(), router.allowedMethods())

  /* eslint-enable */
}