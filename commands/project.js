const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const { EOL } = require('os')
const Err = require('../utils/error_handler')
const project = {}
const colors = require('colors')
const readline = require('readline-sync')
const inquirer = require('inquirer')

project.create = async (argv) => {
  const answer = await inquirer.prompt([{
    type: 'Input',
    name: 'projectName',
    message: 'Project Name: '
  },{
    type: 'Input',
    name: 'group',
    message: 'Gitlab Group Name: '
  },{
    type: 'Input',
    name: 'appId',
    filter: input => Number.parseInt(input),
    message: 'APP_ID : '
  },
  {
    type: 'list',
    name: 'type',
    choices: ['node', 'cronjob', 'web', 'go'],
    message: 'Project Type:',
    default: 'node'
  }])
  let { projectName, group, appId, type } = answer

  let root = `${process.cwd()}/${projectName}`
  if (type === 'go') {
    root = `${process.env.GOPATH}/src/${group}/${projectName}`
  }
  if (fs.existsSync(root)) {
    Err(`Directory [ ${root} ] has already exists`)
    return
  }

  //赋值内容
  const cmd = `mkdir ${root} && cp -a ${path.resolve(`${__dirname}/../tpl/${type}`)}/. ${root} `
  if (shell.exec(cmd).code !== 0) {
    Err(`Create Project Failed`)
    return
  }

  //如果有package.json 修改一下占位符
  if (fs.existsSync(`${root}/package.json`)) {
    if (shell.sed('-i', '{name}', projectName, `${root}/package.json`).code !== 0) {
      Err(`Init package.json Failed`)
      return
    }
  }

  if (shell.sed('-i', '{name}', projectName, `${root}/.env.example`).code !== 0) {
    Err(`Init .env.example Failed`)
    return
  }
  if (shell.sed('-i', '{appId}', appId, `${root}/.env.example`).code !== 0) {
    Err(`Init .env.example Failed`)
    return
  }

  if (shell.cp(`${root}/.env.example`, `${root}/.env`).code !== 0) {
    Err(`Init .env Failed`)
    return
  }

  if (shell.sed('-i', '{name}', projectName, `${root}/tik.json`).code !== 0) {
    Err(`Init tik.json Failed`)
    return
  }
  if (shell.sed('-i', '{appId}', appId, `${root}/tik.json`).code !== 0) {
    Err(`Init tik.json Failed`)
    return
  }
  if (shell.sed('-i', '{type}', type, `${root}/tik.json`).code !== 0) {
    Err(`Init tik.json Failed`)
    return
  }
  if (shell.sed('-i', '{group}', group, `${root}/tik.json`).code !== 0) {
    Err(`Init tik.json Failed`)
    return
  }
  if (type === 'go') {
    if (shell.sed('-i', '{group}', group, `${root}/main.go`).code !== 0) {
      Err(`Init main.go Failed`)
      return
    }
    if (shell.sed('-i', '{name}', projectName, `${root}/main.go`).code !== 0) {
      Err(`Init main.go Failed`)
      return
    }
  }
}

project.release = (argv) => {
  let tikConfig = {
    group: null,
    name: null,
    version: '1.0.0'
  }
  if (fs.existsSync(`${process.cwd()}/tik.json`)) {
    tikConfig = require(`${process.cwd()}/tik.json`)
  }

  if (!tikConfig.group) {
    tikConfig.group = readline.question('Set gitlab group for this repo: (e.g tikcoin )')
    fs.writeFileSync(`${process.cwd()}/tik.json`, JSON.stringify(tikConfig, null, 2))
  }
  if (!tikConfig.name) {
    tikConfig.name = readline.question('Set repo-name : (e.g tikcoin-api)')
    fs.writeFileSync(`${process.cwd()}/tik.json`, JSON.stringify(tikConfig, null, 2))
  }

  console.log(`${EOL}Current version is ${tikConfig.version.yellow}${EOL}`)
  const select = versionSelect(tikConfig.version)
  const newVersion = readline.keyInSelect(select.name, 'You should know that what you are doing !')
  if (newVersion !== -1) {
    if (shell.exec(`git branch release/${select.arr[newVersion]} && git checkout release/${select.arr[newVersion]}`).code !== 0) {
      console.log('something wrong!'.red)
      process.exit()
    }
    tikConfig.version = select.arr[newVersion] || tikConfig.version
    fs.writeFileSync(`${process.cwd()}/tik.json`, JSON.stringify(tikConfig, null, 2))
    console.log('Done !'.green)
  } else {
    console.log('Cancel !'.yellow)
  }
}

project.config = (argv) => {
  let tikConfig

  if (fs.existsSync(`${process.cwd()}/tik.json`)) {
    tikConfig = require(`${process.cwd()}/tik.json`)
  }
  const group = readline.question(`Gitlab Group   (current: ${tikConfig.group || ''})`, { defaultInput: tikConfig.group })
  const name = readline.question(`Repos Name   (current: ${tikConfig.name || ''})`, { defaultInput: tikConfig.name })
  const version = readline.question(`Version   (current: ${tikConfig.version || '1.0.0'})`, { defaultInput: tikConfig.version })
  fs.writeFileSync(`${process.cwd()}/tik.json`, JSON.stringify({ group, name, version }, null, 2))
}

function versionSelect(version) {
  const bits = version.split('.')
  const patch = [bits[0], bits[1], bits[2] * 1 + 1].join('.')
  const feature = [bits[0], bits[1] * 1 + 1, '0'].join('.')
  const major = [bits[0] * 1 + 1, '0', '0'].join('.')
  return {
    arr: [
      patch,
      feature,
      major,
    ],
    name: [
      'patch:' + patch,
      'feature:'.green + feature,
      'major:'.red + major,
    ],
  }
}


module.exports = project