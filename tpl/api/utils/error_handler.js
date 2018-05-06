const bouncer = require('koa-bouncer')
const { error } = require('./response')
//统一的错误处理
module.exports = async (ctx, next) => {
  try {
    return await next();
  } catch (err) {
    let errMsg = err.message
    if (err instanceof bouncer.ValidationError) {
      const { bouncer: { key, message } } = err
      if (message instanceof Array) {
        errMsg = [errMsg[0], `${key} ${message[1]}`]
      } else {
        errMsg = `${key} ${message}`
      }
    }
    return error(ctx, err)
  }
}