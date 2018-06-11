
const success = (ctx, data) => {
  ctx.body = {
    code: 0,
    message: 'success',
  }
  if (data) {
    ctx.body.data = data
  }
  ctx.set('trace-id', ctx.state.traceId)
}

const error = (ctx, err) => {
  if(err instanceof Error){
    err = {
      code: 500000,
      message: err.name + ':' + err.message,
      stack: err.stack,
    }
  }
  let e = err

  let body = {
    code: (process.env['APP_ID'] || 1000) * 1e6 + (e.code || 0),
    message: e.message
  }
  if (e.data) {
    body.data = e.data
  }
  ctx.body = body
  ctx.set('trace-id', ctx.state.traceId)
  ctx.logger.error({
    ...e,
    traceId: ctx.state.traceId
  })
}

const middleware = async (ctx, next) => {
  ctx.success = success
  ctx.error = error
  return await next()
}

module.exports = {
  middleware,
  error,
  success
}
