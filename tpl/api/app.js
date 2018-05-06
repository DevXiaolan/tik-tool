const Koa = require('koa')
const app = new Koa()

const mongo = require('./utils/mongo')

const bodyparser = require('koa-bodyparser')

const router = require('./src/router')

router(app)

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
  multipart: true
}))


module.exports = app