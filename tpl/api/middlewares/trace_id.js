const uuid = require('uuid/v1')
function genId(ctx) {
  if (ctx.request && ctx.request.header && ctx.request.header['trace-id']) {
    ctx.state.traceId = ctx.request.header['trace-id']
    return;
  }
  ctx.state.traceId = uuid()
  return
}

module.exports = async (ctx, next) => {
  genId(ctx)
  log.info({
    type: 'access',
    method: ctx.request.method,
    url: ctx.request.url,
    traceId: ctx.state.traceId,
  })
  await next()
  log.info({
    type: 'access',
    status: ctx.response.status,
    message: ctx.response.message,
    traceId: ctx.state.traceId,
  })
}
