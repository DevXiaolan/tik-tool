#!/usr/bin/env node

const yargs = require('yargs');
const colors = require('colors');
const { EOL } = require('os');
const { help, project } = require('./commands')

let argv = yargs
  .epilog('Power by TIK'.green)
  .argv

if (argv.h === true || argv.help === true) {
  help(argv)
  process.exit(0)
}

let command = argv._[0]

switch (command) {
  // 你好世界 tik helloworld
  case 'helloworld':
    break
  // 创建项目 tik create {projectname}
  case 'create':
    project.create(argv)
    break
  default:
    break
}