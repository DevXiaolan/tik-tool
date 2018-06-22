const schedule = require('node-schedule')
const rate = require('./src/rate')
const stock = require('./src/stock')
const orderTimer = require('./src/order-timer')

rate.start()
schedule.scheduleJob('0 0 */2 * * *', () => {
  rate.start()
})

stock.start()
schedule.scheduleJob('0 */1 * * * *', () => {
  stock.start()
})

orderTimer.start()
schedule.scheduleJob('0 */1 * * * *', ()=>{
  orderTimer.start()
})