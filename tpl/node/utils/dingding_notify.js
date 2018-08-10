/**
 * Created by luowen on 2018/6/14
 */

const rp = require('request-promise')

/**
 * 钉钉通知
 * @param content
 * @returns {Promise<void>}
 */
const notify = async (content) => {

  // 根据环境，确定 uri 内容
  let uri = process.env.DING_DING_URI

  // 钉消息
  let atMobiles = process.env.DING_DING_AT.split(',')

  const options = {
    method: 'POST',
    uri,
    body: {
      msgtype: 'text',
      text: {
        content
      },
      at: {
        atMobiles,
        isAtAll: false,
      }
    },
    headers: { 'content-type': 'application/json' },
    json: true
  }

  // notification
  return rp(options)
}

/**
 * 新卖单
 */
const notifyCreateTrade = async ({ type, periodDisplayName, price, totalSupply }) => {
  const typeMap = {
    '1': '卖',
    '2': '买'
  }
  return notify(`[新${typeMap[type]}单]
标的：${periodDisplayName}
单价：${price}
数量：${totalSupply}
`)
}

module.exports = {
  notify,
  notifyCreateTrade,
}

