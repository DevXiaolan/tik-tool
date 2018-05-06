let { EOL } = require('os')
let conf = require('dotenv').load('../.env')

console.log(EOL + '============CONFIG============')
for (let k in process.env) {
  console.log(`${k}\t${process.env[k]}`)
}
console.log('==============================' + EOL)

const CONFIG = require('../config/app')

require('../app').listen(CONFIG.PORT)
console.log(`${EOL}starting at port ${CONFIG.PORT}`)