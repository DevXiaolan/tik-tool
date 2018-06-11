const router = require('koa-router')()

const demo = require('./controllers/demo')

router.prefix('/v1')

router.get('/', demo.index)
router.post('/', demo.p)

module.exports = router