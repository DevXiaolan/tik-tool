const request = require('request-promise')
const colors = require('colors')


module.exports = async () => {
  const resp = await request.get('http://172.20.160.7:4873/-/search/tik-tool').json()
  const pkg = require('../package.json')
  if (pkg.version !== resp.version) {
    console.log('='.repeat(64).red)
    console.log(`当前版本:${pkg.version.yellow}, 建议升级到:${resp[0].version.green}`)
    console.log('='.repeat(64).red)
  }
  return true
}
