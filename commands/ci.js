const colors = require('colors')
const dotenv = require('dotenv')
const shell = require('shelljs')
const fs = require('fs')
const { EOL } = require('os')
const Err = require('../utils/error_handler')

const init = (argv) => {
  const projectRoot = process.cwd()
  if (fs.existsSync(`${projectRoot}/tik.json`) && fs.existsSync(`${projectRoot}/.env`)) {
    dockerCompose(projectRoot)
    rancherCompose(projectRoot)
    syncEnv(projectRoot)
    gitlabCI(projectRoot)
  } else {
    Err(`Project Root Invalid: ${projectRoot}`)
  }
}

const dockerCompose = (projectRoot) => {
  const env = dotenv.load({ path: `${projectRoot}/.env` }).parsed
  const pkg = require(`${projectRoot}/tik.json`)
  const tpl =
    `version: '2'
services:
  ${pkg.name || ''}:
    image: ${pkg.name}:${pkg.version}
    environment:
${(env => {
      let output = ``
      for (const k in env) {
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
  const pkg = require(`${projectRoot}/tik.json`)
  const tpl = `version: '2'
services:
  ${pkg.name}:
    upgrade_strategy:
      start_first: true
    scale: 1
    start_on_create: true`
  fs.writeFileSync(`${projectRoot}/rancher-compose.yml`, tpl)
  console.log(`File generated: ${projectRoot}/rancher-compose.yml`.blue)
}
/**
 * out of date
 */
const buildFile = (projectRoot) => {
  const pkg = require(`${projectRoot}/tik.json`)
  const tpl = `docker build -t ${pkg.name}:${pkg.version} .`
  fs.writeFileSync(`${projectRoot}/build`, tpl)
  shell.chmod('+x', `${projectRoot}/build`)
  console.log(`File generated: ${projectRoot}/build`.blue)
}

/**
 * out of date
 */
const upgrade = (projectRoot) => {
  const pkg = require(`${projectRoot}/tik.json`)
  const tpl = `rancher --url http://172.20.160.7:8080/v2-beta --access-key 3F9EAEABA64D4876F506 --secret-key vyg17c8244obWeB8HoSGeeHVg54LGdTWMVj4yU6V up -d  --pull --force-upgrade --confirm-upgrade --stack coins007-${pkg.name}-${pkg.version}`
  fs.writeFileSync(`${projectRoot}/upgrade`, tpl)
  shell.chmod('+x', `${projectRoot}/upgrade`)
  console.log(`File generated: ${projectRoot}/upgrade`.blue)
}

const gitlabCI = (projectRoot) => {
  const env = dotenv.load({ path: `${projectRoot}/.env` }).parsed
  const pkg = require(`${projectRoot}/tik.json`)
  const tpl = `cache:
  untracked: true
  key: \${CI_COMMIT_REF_SLUG}
stages:
  - test
  - build
  - deploy

job_test:
  stage: test
  image: node:9.11.1
  script: 
    - npm install --registry=https://registry.npm.taobao.org
    - npm test
  variables:
${(env => {
      let output = ``
      for (const k in env) {
        output += `    ${k}: ${env[k] || '""'}${EOL}`
      }
      return output
    })(env)}

job_build_latest:
  stage: build
  image: gitlab/dind
  only:
    - master
  script:
    - docker build -t ${pkg.name}:latest .
  
job_build_release:
  stage: build
  image: gitlab/dind
  only:
    - /^release.*$/
  script:
    - docker build -t ${pkg.name}:${pkg.version} .
    - docker tag ${pkg.name}:${pkg.version} hub.tik:5000/${pkg.name}:${pkg.version}
    - docker push hub.tik:5000/${pkg.name}:${pkg.version}

job_deploy:
  stage: deploy
  image: registry.cn-hangzhou.aliyuncs.com/dev_tool/rancher-cli
  only:
    - master
  script:
    - rm -f ~/.rancher/cli.json
    - rancher --url http://172.20.160.7:8080/v2-beta --access-key 3F9EAEABA64D4876F506 --secret-key vyg17c8244obWeB8HoSGeeHVg54LGdTWMVj4yU6V up -d  --pull --force-upgrade --confirm-upgrade --stack coins007-${pkg.name}-${pkg.version}`

  fs.writeFileSync(`${projectRoot}/.gitlab-ci.yml`, tpl)
  console.log(`File generated: ${projectRoot}/.gitlab-ci.yml`.blue)
}

function syncEnv(projectRoot) {
  if (!fs.existsSync(`${projectRoot}/.env`)) {
    return
  }
  const env = fs.readFileSync(`${projectRoot}/.env`).toString().split(EOL)
  const envExample = []
  for (const k in env) {
    const kv = env[k].split('=')
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
