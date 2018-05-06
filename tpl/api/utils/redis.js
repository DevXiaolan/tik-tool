/**
 * Created by luowen on 2018/4/13
 */

const redisConfig = require('../config/redis')

const ioredis = require('ioredis').createClient(redisConfig)

module.exports = ioredis

