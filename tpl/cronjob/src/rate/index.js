/*
 * @Author: Mr.He 
 * @Date: 2018-05-25 11:32:45 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2018-06-04 11:17:43
 */

const request = require('request-promise')
const RateModel = require('../../model/rate')
const moment = require('moment')

const { HOST_DATA_BLOCK, PATH_BLOCK_CC_RATES } = require('../../config/config.json')

/**
 * 获取汇率数据
 */


//所需币种
let currencies = ['HKD', 'USDT', 'USD', 'EUR', 'JPY', 'BTC', 'ETH', 'EOS', 'ETC', 'KRW']

exports.start = async () => {

  let result = await request({
    uri: HOST_DATA_BLOCK + PATH_BLOCK_CC_RATES,
    method: 'get'
  })

  try {
    result = JSON.parse(result)
  } catch (e) {
    //console.error(e)
  }

  if (result.code !== 0) {
    console.error('rate task fail!')
    return
  }

  let rates = result.data.rates,
    date = moment().format('YYYY-MM-DD')
  let ps = []
  for (let item of currencies) {
    if (!rates[item]) {
      continue
    }

    ps.push(RateModel.update(
      {
        base: 'CNY',
        name: item,
      }, {
        $set: {
          rates: rates[item],
          date
        }
      }, {
        upsert: true
      }))
  }

  try {
    await Promise.all(ps)
    console.info(`${date} 汇率任务记录结束.`)
  } catch (e) {
    console.info(`${date} 汇率任务出错.`)
    console.error(e)
  }
}