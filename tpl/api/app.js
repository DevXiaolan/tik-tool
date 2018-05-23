const Koa = require('koa')
const app = new Koa()

const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const bouncer = require('koa-bouncer')

const cors = require('./middlewares/cors')
const mongo = require('./utils/mongo')
const router = require('./src/router')
const errorHandler = require('./middlewares/error_handler')
const traceId = require('./middlewares/trace_id')
const response = require('./middlewares/response')

const log4js = require('./utils/logger')
global.log = log4js.getLogger(process.env['LOGGER'] || 'daily')

if ('development'===process.env['NODE_ENV']) {
  app.use(logger())
}


app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
  multipart: true
}))
.use(response)
.use(errorHandler)
.use(cors)
.use(bouncer.middleware())
.use(traceId)


router(app)

module.exports = app