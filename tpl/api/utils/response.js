
const success = (ctx, data, code = 0, message = 'Success') => {
  ctx.body = {
    code,
    message,
  }
  if (data) {
    ctx.body.data = data
  }
}

const error = (ctx, err, option = {}) => {
  let e = { ...err, ...option }
  let body = {
    code: (process.env['APP_ID'] || 1000) * 1e6 + (e.code || 0),
    message: e.message
  }
  if (e.data) {
    body.data = e.data
  }
  ctx.body = body
}

module.exports = {
  error,
  success
}
