const DEFAULT_APP_ID = 1000
//appid 默认偏移
const BASE = 1e6

const DEFAULT_ERROR_CODE = 0

const success = (ctx, data) => {
  ctx.body = {
    code: 0,
    message: 'success',
  }
  ctx.body.data = data
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
    code: (process.env.APP_ID || DEFAULT_APP_ID) * BASE + (e.code || DEFAULT_ERROR_CODE),
    message: e.message
  }
  
  body.data = e.data
  
  ctx.body = body
  ctx.set('trace-id', ctx.state.traceId)
  ctx.logger.error({
    ...e,
    traceId: ctx.state.traceId
  })
}


module.exports = {
  error,
  success
}
