const { unCaughtError } = require('../utils/response');
// 统一的错误处理
module.exports = async (ctx, next) => {
  try {
    return await next();
  } catch (err) {
    return unCaughtError(ctx, err);
  }
};
