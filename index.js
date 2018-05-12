#!/usr/bin/env node

const yargs = require('yargs');
const colors = require('colors');
const { EOL } = require('os');
const { help, project, ci } = require('./commands')

let argv = yargs
  .epilog('Power by TIK'.green)
  .argv

if (argv.h === true || argv.help === true) {
  help(argv)
  process.exit(0)
}

let command = argv._[0]

switch (command) {
  // 创建项目 tik create {projectname}
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
  // todo tik gen {xxx}
  case 'gen':
    break;
  default:
    break
}
