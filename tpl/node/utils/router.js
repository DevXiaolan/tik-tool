const fs = require('fs');
const path = require('path');
const healthRouter = require('koa-router')();
const tikConf = require('../tik.json');

healthRouter.get('/:version/ping', ctx => {
  return ctx.success(tikConf);
});
healthRouter.get('/:version/swagger', async ctx => {
  if (fs.existsSync(path.resolve(`${__dirname}/../swagger.json`))) {
    ctx.body = require('../swagger.json');
    return;
  }
  // eslint-disable-next-line
  return ctx.success('swagger.json not found');
});

module.exports = app => {
  /* eslint-disable */
  const basePath = path.resolve(`${__dirname}/../src`);

  app.use(healthRouter.routes(), healthRouter.allowedMethods());

  const router = require(`${basePath}/router.js`);
  router.prefix(`/:version`);

  app.use(router.routes(), router.allowedMethods());

  /* eslint-enable */
};
