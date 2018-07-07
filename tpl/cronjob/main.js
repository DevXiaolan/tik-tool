const schedule = require('node-schedule')
const demo = require('./src/demo')


demo.start()
schedule.scheduleJob('0 0 */2 * * *', () => {
  demo.start()
})

