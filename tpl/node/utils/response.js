const DEFAULT_APP_ID = 1000;
// appid 默认偏移
const BASE = 1e6;
const CODE_LENGTH = 10;
const DEFAULT_ERROR_CODE = 0;

const success = (ctx, data) => {
  ctx.body = {
    code: 0,
    message: 'success'
  };
  ctx.body.data = data;
  ctx.set('trace-id', ctx.state.traceId);
};

const error = (ctx, err) => {
  if (err instanceof Error) {
    err = {
      code: 500000,
      message: `${err.name}:${err.message}`,
      stack: err.stack
    };
  }
  const e = err;

  let body = {
    code:
      (process.env.APP_ID || DEFAULT_APP_ID) * BASE +
      (1 * e.code || DEFAULT_ERROR_CODE),
    message: e.message
  };
  body.data = e.data;

  // 如果是内部服务返回的错误结构，直接返回到 client
  // 优化一下判断逻辑
  if (`${err.code}`.length === CODE_LENGTH) {
    body = err;
  }

  ctx.body = body;
  ctx.set('trace-id', ctx.state.traceId);
  ctx.logger.error({
    ...e,
    traceId: ctx.state.traceId
  });
};

const unCaughtError = (ctx, err) => {
  if (err instanceof Error) {
    err = {
      code: 500000,
      message: `${err.name}:${err.message}`,
      stack: err.stack
    };
  }

  let body = {
    code:
      (process.env.APP_ID || DEFAULT_APP_ID) * BASE +
      (1 * err.code || DEFAULT_ERROR_CODE),
    message: err.message || 'unknown error'
  };
  body.data = err.data;

  // 如果是内部服务返回的错误结构，直接返回到 client
  // 优化一下判断逻辑
  if (`${err.code}`.length === CODE_LENGTH) {
    body = err;
  }

  ctx.body = body;
  ctx.set('trace-id', ctx.state.traceId);
  ctx.logger.warn({
    ...err,
    traceId: ctx.state.traceId
  });
  // 出口记录一次
  ctx.logger.info({
    type: 'OUT',
    status: ctx.response.status,
    message: ctx.response.message,
    traceId: ctx.state.traceId,
    body: ctx.body
  });
};

module.exports = {
  error,
  success,
  unCaughtError
};
