#!/usr/bin/env node

const yargs = require('yargs')
const colors = require('colors')
const { EOL } = require('os')
const { help, project, ci } = require('./commands')
const Gen = require('./commands/gen')
const argv = yargs
  .epilog('Power by TIK'.green)
  .argv

if (argv.h === true || argv.help === true) {
  help(argv)
  process.exit(0)
}

const command = argv._[0]
const subCommand = argv._[1]
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

    if (subCommand === undefined) {
      require('./commands/optimization').dependence()
    } else {
      require('./commands/optimization').detail(subCommand)
    }
    break
  // 生成swagger tik swagger
  case 'swagger':
    require('./commands/swagger')(argv)
    break
  // 代码生成器 tik gen {xxx}
  case 'gen':
    if (Gen[subCommand]) {
      Gen[subCommand](argv)
    } else {
      
    }
    break
  default:
    break
}
