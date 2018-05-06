const xiaolanAst = require('xiaolan-ast')
const path = require('path')
const colors = require('colors')
const { EOL } = require('os')

module.exports = (argv) => {
  let entrance = path.resolve(__dirname + '/../index.js')
  let helpers = xiaolanAst.genHelper(entrance)
  if (argv._[0]) {
    helpers = {
      [argv._[0]]: helpers[argv._[0]]
    }
  }
  for (let k in helpers) {
    let help = helpers[k]
    printHelper(help)
  }
}

function printHelper(helper) {
  console.log(`${helper.name.yellow}  ${helper.desc}${EOL}Usage:${EOL}  ${helper.usage.cyan}${EOL}`)
}