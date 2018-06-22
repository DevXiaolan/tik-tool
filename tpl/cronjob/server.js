
const conf = require('dotenv').load()

//env覆盖进去，保证项目设置的env优先级最高
Object.assign(process.env, conf.parsed || {})

require('./utils/mongo')
require('./utils/cache')

const log4js = require('./utils/logger')
global.log = log4js.getLogger(process.env.LOGGER || 'daily')


require('./main.js')