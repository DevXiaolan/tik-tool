const uuid = require('uuid/v1');

function genId(ctx) {
  if (ctx.request && ctx.request.header && ctx.request.header['trace-id']) {
    ctx.state.traceId = ctx.request.header['trace-id'];
    return;
  }
  ctx.state.traceId = uuid();
}

module.exports = async (ctx, next) => {
  genId(ctx);
  await next();
};
