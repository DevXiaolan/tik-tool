const log4js = require('../utils/logger')

module.exports = async (ctx, next) => {
  const logger = log4js.getLogger(process.env.LOGGER)
  ctx.logger = {
    info: (data) => {
      logger.info({ data, traceId: ctx.state.traceId })
    },
    error: (data) => {
      logger.error({ data, traceId: ctx.state.traceId })
    },
    fatal: (data) => {
      logger.fatal({ data, traceId: ctx.state.traceId })
    }
  }
  ctx.logger.info({
    type: 'IN',
    method: ctx.request.method,
    url: ctx.request.url,
    traceId: ctx.state.traceId,
    header: ctx.request.header,
    query: ctx.request.query,
    body: ctx.request.body
  })
  await next()
  ctx.logger.info({
    type: 'OUT',
    method: ctx.request.method,
    url: ctx.request.url,
    status: ctx.response.status,
    message: ctx.response.message,
    traceId: ctx.state.traceId,
    body: ctx.body
  })
}