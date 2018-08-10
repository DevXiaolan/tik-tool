const mongoose = require('mongoose')

const DEFAULT_PORT = 27017

const CONFIG = {
  // 数据库
  NAME: process.env.MONGO_DBNAME || 'test',
  // 用户名 (无用户名为空字符串)
  USERNAME: process.env.MONGO_USER || '',
  // 密码 (无用户名为空字符串)
  PASSWORD: process.env.MONGO_PASSWORD || '',
  // host
  HOST: process.env.MONGO_HOST || 'localhost',
  // 端口
  PORT: process.env.MONGO_PORT || DEFAULT_PORT,
}

mongoose.Promise = global.Promise

mongoose.connect(`mongodb://${CONFIG.USERNAME ? `${CONFIG.USERNAME}:${CONFIG.PASSWORD}@` : ''}${CONFIG.HOST}:${CONFIG.PORT}/${CONFIG.NAME}`, { useNewUrlParser: true })


module.exports = mongoose