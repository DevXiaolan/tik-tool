const OrderModel = require('../../model/order')
const TradeModel = require('../../model/trade')
const moment = require('moment')

//买单：创建
const ORDER_CREATED = 1
//买单：用户点击确认付款
const ORDER_CONFIRM = 2
//买单：客服确认并交易完成
const ORDER_FINISHED = 3
//买单：错误&取消
const ORDER_CANCEL = 4
//卖单：新建待审核
const TRADE_CREATED = 1
//卖单：正常
const TRADE_OK = 2
//卖单：下架
const TRADE_OFF = 3
//卖单：非法
const TRADE_CANCEL = 4

//默认10分钟 10*60*1000 = 600000
const DEFAULT_EXPIRE_TIME = 600000

const cancelOrder = async (order) => {
  //检查trade是否异常
  const trade = await TradeModel.findOne({
    _id: order.tradeId
  })
  //trade不存在，数据异常
  if (!trade) {
    log.error({
      ...order,
      message: 'trade not found'
    })
    return false
  }
  //trade状态不是2.正常， 数据异常
  if (trade.status !== TRADE_OK) {
    log.error({
      ...trade,
      message: 'trade status error'
    })
    return false
  }

  //状态变更为 4.用户取消 
  order.status = ORDER_CANCEL
  await order.save()

  //购买锁定部分，返回到卖单库存
  const MILLION = 1000000
  trade.restSuply = (Number.parseInt(MILLION * trade.restSuply) + Number.parseInt(MILLION * order.qty)) / MILLION

  //如果库存大于总量，就有问题了
  if (trade.restSuply > trade.totalSuply) {
    log.error({
      ...trade,
      message: 'trade suply error'
    })
    return false
  }
  await trade.save()
  console.log(`${order._id} Done.`)
  return true
}

module.exports = {
  start: async () => {
    const date = moment().format('YYYY-MM-DD')
    const orderList = await OrderModel.find({
      status: ORDER_CREATED,
      createdAt: {
        $lt: Date.now() - Number.parseInt(process.env.EXPIRE_TIME || DEFAULT_EXPIRE_TIME)
      }
    }).sort({ createdAt: -1 })

    const tasks = []
    orderList.forEach((order) => {
      tasks.push(cancelOrder(order))
    })
    await Promise.all(tasks)
    console.log(`${date} clear.`)
  }
}