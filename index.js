#!/usr/bin/env node

const yargs = require('yargs')
const colors = require('colors')
const { EOL } = require('os')
const { help, project, ci } = require('./commands')

const argv = yargs
  .epilog('Power by TIK'.green)
  .argv

if (argv.h === true || argv.help === true) {
  help(argv)
  process.exit(0)
}

const command = argv._[0]

switch (command) {
  // 创建项目 tik create
  case 'create':
    project.create(argv)
    break
  // 更新服务版本(就是修改package.json) tik release
  case 'release':
    project.release(argv)
    break
  // 生成CI相关配置 tik ci
  case 'ci':
    ci.init()
    break
  // 生成docker相关配置 tik docker
  case 'docker':
    ci.docker()
    break
  // 项目优化检查 tik opt
  case 'opt':
    const subCommand = argv._[1]
    if (subCommand === undefined) {
      require('./commands/optimization').dependence()
    } else {
      require('./commands/optimization').detail(subCommand)
    }
    break
  // tik swagger
  case 'swagger':
    require('./commands/swagger')(argv)
    break
  // todo tik gen {xxx}
  case 'gen':

    break
  default:
    break
}
