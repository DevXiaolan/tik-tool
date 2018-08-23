const router = require('koa-router')();

const demo = require('./controllers/demo');

router.get('/', demo.index);
router.post('/', demo.p);

module.exports = router;
