const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 6379
const DEFAULT_DB = 0

const ioredis = require('ioredis').createClient({
  host: process.env.REDIS_HOST || DEFAULT_HOST,
  port: process.env.REDIS_PORT || DEFAULT_PORT,
  db: process.env.REDIS_DB || DEFAULT_DB
})

module.exports = ioredis
