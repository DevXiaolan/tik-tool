
const response = require('../utils/response')

/**
 * 简化返回参数，去掉 ctx
 * @param ctx
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async (ctx, next) => {
  ctx.success = function (...args) {
    return response.success(ctx, ...args)
  }
  ctx.error = function (...args) {
    return response.error(ctx, ...args)
  }
  return await next()
}

