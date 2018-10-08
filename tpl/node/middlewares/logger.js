const log4js = require('../utils/logger');

module.exports = async (ctx, next) => {
  const logger = log4js.getLogger(process.env.LOGGER);
  ctx.logger = {
    info: data => {
      logger.info({ data, traceId: ctx.state.traceId });
    },
    warn: data => {
      logger.warn({ data, traceId: ctx.state.traceId });
    },
    error: data => {
      logger.error({ data, traceId: ctx.state.traceId });
    }
  };
  ctx.logger.info({
    type: 'IN',
    method: ctx.request.method,
    url: ctx.request.url,
    traceId: ctx.state.traceId,
    header: ctx.request.header,
    query: ctx.request.query,
    body: ctx.request.body
  });
  const start = process.hrtime();
  await next();
  const end = process.hrtime(start);
  // 接口运行时间 ms
  const t = (end[0] * 1e9 + end[1]) / 1e6;

  // 如果时间大于阈值
  if (t > (process.env.MAX_EXEC_TIME || 1000)) {
    ctx.logger.error({
      t,
      traceId: ctx.state.traceId,
      message: `接口执行时间太长: ${t} ms`
    });
  }
  ctx.logger.info({
    t,
    type: 'OUT',
    status: ctx.response.status,
    message: ctx.response.message,
    traceId: ctx.state.traceId,
    body: ctx.body
  });
};
