const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const readline = require('readline-sync')
const Err = require('../utils/error_handler')
const project = {}

project.create = (argv) => {
  let projectName = argv._[1]

  if (!projectName) {
    Err('Project Name Required!')
    return
  }

  let root = `${process.cwd()}/${projectName}`
  if (fs.existsSync(root)) {
    Err(`Directory [ ${root} ] has already exists`)
    return
  }
  //todo 检验名字合法性
  let items = ['api']
  let type = items[readline.keyInSelect(items, 'Project Type:')]
  if (!type) {
    console.log('DO NOTING!'.yellow)
    process.exit()
  }


  let cmd = `mkdir ${root} && cp -R ${path.resolve(`${__dirname}/../tpl/${type}`)}/* ${root}`
  if (shell.exec(cmd).code !== 0) {
    Err(`Create Project Failed`)
    return
  }
}

module.exports = project