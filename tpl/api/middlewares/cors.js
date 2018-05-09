const cors = require('koa2-cors')

process.env.ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || []
module.exports = cors({
  origin: ctx => process.env.ALLOW_ORIGIN.includes(ctx.request.header.origin) ? ctx.request.header.origin: false,
  // origin:  "*",
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Access-Control-Allow-Credentials'],
})