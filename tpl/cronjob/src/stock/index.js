/*
 * @Author: Mr.He 
 * @Date: 2018-05-25 14:23:16 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2018-05-25 15:04:12
 */

const request = require('request-promise')
const cache = require('../../utils/cache')
const moment = require('moment')
let { STOCK_RESOURCE } = require('../../config/config.json')
let stocks = require('../../config/stock.json')

let getStockInfo = async (keyword) => {
  let result = await request({
    uri: STOCK_RESOURCE,
    qs: {
      keyword
    }
  })

  try {
    result = JSON.parse(result)
  } catch (e) {
    log.error(e)
  }

  if (result.status && result.status.code === 0) {
    let data = {
      code: keyword,
      data: result.data,
      time: moment().format()
    }
    await cache.write(`stock:${keyword}`, data)
  }
}




exports.start = async () => {
  let stockCodes = Object.keys(stocks)
  try {
    await Promise.all(stockCodes.map(async (val) => {
      return getStockInfo(val)
    }))
    console.info(`${moment().format()} 股票更新任务结束`)
  } catch (e) {
    console.error(`${moment().format()} 股票更新任务失败`)
    log.error(e)
  }
}