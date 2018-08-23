const error = require('../error');

const index = async ctx => {
  ctx.logger.info('what');
  return ctx.success('hello');
};

const p = async () => {
  throw error.DEMO_NOT_FOUND;
};

module.exports = {
  index,
  p
};
