const Koa = require('koa')
const app = new Koa()

const bodyparser = require('koa-bodyparser')
const bouncer = require('koa-bouncer')

const cors = require('./middlewares/cors')
const mongo = require('./utils/mongo')
const router = require('./utils/router')
const errorHandler = require('./middlewares/error_handler')
const traceId = require('./middlewares/trace_id')
const response = require('./middlewares/response')
const logger = require('./middlewares/logger')


app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
  multipart: true
}))
  
  .use(response)
  .use(errorHandler)
  .use(cors)
  .use(bouncer.middleware())
  .use(traceId)
  .use(logger)


router(app)

module.exports = app