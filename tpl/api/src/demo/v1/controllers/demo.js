const response = require("../../../../utils/response")
const error = require('../error')

const index = async (ctx) => {
  return response.success(ctx, 'hello')
}

const p = async (ctx) => {
  throw error.DEMO_NOT_FOUND
}

module.exports = {
  index,
  p
}