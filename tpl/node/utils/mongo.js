const mongoose = require('mongoose')

const CONFIG = {
  // 数据库
  NAME: process.env.MONGO_DBNAME,
  // 用户名 (无用户名为空字符串)
  USERNAME: process.env.MONGO_USER,
  // 密码 (无用户名为空字符串)
  PASSWORD: process.env.MONGO_PASSWORD,
  // host
  HOST: process.env.MONGO_HOST,
  // 端口
  PORT: process.env.MONGO_PORT,
}

mongoose.Promise = global.Promise

mongoose.connect(`mongodb://${CONFIG.HOST}:${CONFIG.PORT}/${CONFIG.NAME}`)

module.exports = mongoose