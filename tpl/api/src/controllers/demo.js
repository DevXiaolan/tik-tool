const index = async (ctx) => {
  ctx.logger.info('what')
  return ctx.success('hello')
}

const p = async (ctx) => {
  throw error.DEMO_NOT_FOUND
}

module.exports = {
  index,
  p
}