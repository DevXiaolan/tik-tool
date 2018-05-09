const colors = require('colors')
const dotenv = require('dotenv')
const shell = require('shelljs')
const fs = require('fs')
const { EOL } = require('os')
const Err = require('../utils/error_handler')

const init = (argv) => {
  let projectRoot = process.cwd()
  if (fs.existsSync(`${projectRoot}/package.json`) && fs.existsSync(`${projectRoot}/.env`)) {
    dockerCompose(projectRoot)
    rancherCompose(projectRoot)
    syncEnv(projectRoot)
    buildFile(projectRoot)
    upgrade(projectRoot)
  } else {
    Err(`Project Root Invalid: ${projectRoot}`)
  }
}

const dockerCompose = (projectRoot) => {
  let env = dotenv.load({ path: `${projectRoot}/.env` }).parsed

  let pkg = require(`${projectRoot}/package.json`)
  let tpl =
    `version: '2'
services:
  ${env.APP_NAME || ''}:
    image: ${env.APP_NAME}:${pkg.version}
    environment:
${(env => {
      let output = ``
      for (let k in env) {
        output += `      ${k}: ${env[k] || '""'}${EOL}`
      }
      return output
    })(env)}
    stdin_open: true
    external_links:
    - database/mongo:mongo
    - database/redis:redis
    volumes:
    - /tmp:/tmp
    tty: true
`
  fs.writeFileSync(`${projectRoot}/docker-compose.yml`, tpl)
  console.log(`File generated: ${projectRoot}/docker-compose.yml`.blue)
}

const rancherCompose = (projectRoot) => {
  let env = dotenv.load({ path: `${projectRoot}/.env` }).parsed
  let tpl = `version: '2'
services:
  ${env.APP_NAME}:
    scale: 2
    start_on_create: true`
  fs.writeFileSync(`${projectRoot}/rancher-compose.yml`, tpl)
  console.log(`File generated: ${projectRoot}/rancher-compose.yml`.blue)
}

const buildFile = (projectRoot) => {
  let env = dotenv.load({ path: `${projectRoot}/.env` }).parsed
  let pkg = require(`${projectRoot}/package.json`)
  
  let tpl = `docker build -t ${env.APP_NAME}:${pkg.version} .
docker rmi \`docker images -q -f dangling=true\``
  fs.writeFileSync(`${projectRoot}/build`, tpl)
  shell.chmod('+x', `${projectRoot}/build`)
  console.log(`File generated: ${projectRoot}/build`.blue)
}


const upgrade = (projectRoot) => {
  let env = dotenv.load({ path: `${projectRoot}/.env` }).parsed
  let pkg = require(`${projectRoot}/package.json`)
  let tpl = `rancher up -d  --pull --force-upgrade --confirm-upgrade --stack coins007-${env.APP_NAME}-${pkg.version}`
  fs.writeFileSync(`${projectRoot}/upgrade`, tpl)
  shell.chmod('+x', `${projectRoot}/upgrade`)
  console.log(`File generated: ${projectRoot}/upgrade`.blue)
}

function syncEnv(projectRoot) {
  if (!fs.existsSync(`${projectRoot}/.env`)) {
    return
  }
  let env = fs.readFileSync(`${projectRoot}/.env`).toString().split(EOL)
  let envExample = []
  for (let k in env) {
    let kv = env[k].split('=')
    if (kv[1] === undefined) {
      envExample.push(kv[0])
      continue
    }
    envExample.push(kv[0] + '=')
  }
  fs.writeFileSync(`${process.cwd()}/.env.example`, envExample.join(EOL))
}

module.exports = {
  init,
}

