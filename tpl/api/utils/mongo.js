const mongoose = require('mongoose')

const commonFields = require('./common_field')

const DEFAULT_HOST = '127.0.0.1'

const DEFAULT_PORT = 27017

const DEFAULT_DB = 'test'

const CONFIG = {
  // 数据库
  NAME: process.env.MONGO_DBNAME || DEFAULT_DB,
  // 用户名 (无用户名为空字符串)
  USERNAME: process.env.MONGO_USER || '',
  // 密码 (无用户名为空字符串)
  PASSWORD: process.env.MONGO_PASSWORD || '',
  // host
  HOST: process.env.MONGO_HOST || DEFAULT_HOST,
  // 端口
  PORT: process.env.MONGO_PORT || DEFAULT_PORT,
}

mongoose.Promise = global.Promise

mongoose.connect(`mongodb://${CONFIG.USERNAME ? `${CONFIG.USERNAME}:${CONFIG.PASSWORD}@` : ''}${CONFIG.HOST}:${CONFIG.PORT}/${CONFIG.NAME}`)

module.exports = mongoose