#!/usr/bin/env node

const yargs = require('yargs')
const colors = require('colors')
const shell = require('shelljs')
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
  // 升级本程序 tik upgrade
  case 'upgrade':
    let pkg = require('./package.json')
    console.log(`current version: ${pkg.version.green}`)
    console.log(`☕️ 🍞 about uograde ...🐌`)
    
    if (0 === shell.exec('npm i -g tik-tool --registry=http://172.20.160.7:4873').code) {
      delete require.cache[require.resolve('./package.json')]
      pkg = require('./package.json')
      console.log(`latest version: ${pkg.version.green}`)
      console.log('Upgrade OK'.green)  
      process.exit()
    }
    console.log('Upgrade Failed'.red)
    process.exit()
    break
  // 生成postman配置
  case 'postman':
  require('./commands/postman')(argv)
    break
  default:
    break
}
