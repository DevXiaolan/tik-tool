const { EOL, hostname } = require('os')
const log4js = require('log4js')

log4js.addLayout('json', function (config) {
  return function (logEvent) {
    return JSON.stringify({
      app: process.env['APP_NAME'] || 'unnamed',
      time: logEvent.startTime,
      level: logEvent.level.levelStr,
      data: logEvent.data[0],
      host: hostname()
    })
  }
})


log4js.configure({
  appenders: {
    daily: {
      type: 'dateFile',
      layout: {
        type: 'json'
      },
      filename: `${process.env['LOG_PATH'] || '/tmp'}/${process.env['APP_NAME'] || 'unnamed'}`,
      pattern: '.yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      compress: true
    }
  },
  categories: {
    default: {
      appenders: ['daily'],
      level: 'info'
    }
  }
})

module.exports = log4js