const dotenv = require('dotenv')
const { EOL } = require('os')
const fs = require('fs')

const { formatName } = require('../../../utils/func')
const Base = require('./base')

module.exports = class Web extends Base {
  constructor(argv) {
    super(argv)
    this.env = dotenv.load({ path: `${this.projectRoot}/.env` }).parsed
  }

  gitlabCI() {
    const projectRoot = this.projectRoot
    const env = this.env
    const pkg = require(`${projectRoot}/tik.json`)
    pkg.name = formatName(pkg.name)
    const tpl = `cache:
  untracked: true
  key: cache_\${CI_COMMIT_REF_SLUG}
stages:
  - build
  - deploy

job_build_webpack:
  stage: build
  image: hub.tik:5000/node:tik
  script:
    - npm install --registry=https://registry.npm.taobao.org
    - npm run build
    - tik docker
  only:
    - master
    - /^release.*$/
  variables:
${(env => {
        let output = ``
        for (const k in env) {
          output += `    ${k}: ${env[k] || '""'}${EOL}`
        }
        return output
      })(env)}

job_build_docker_release:
  stage: build
  image: gitlab/dind
  only:
    - /^release.*$/
  script:
    - docker build -t ${pkg.name}:${pkg.version} .

job_build_docer_stable:
  stage: build
  image: gitlab/dind
  only:
    - master
  script:
    - docker build -t ${pkg.name}:stable .  

job_deploy:
  stage: deploy
  image: registry.cn-hangzhou.aliyuncs.com/dev_tool/rancher-cli
  only:
    - master
  script:
    - rm -f ~/.rancher/cli.json
    - rancher --url http://172.20.160.7:8080/v2-beta --access-key 3F9EAEABA64D4876F506 --secret-key vyg17c8244obWeB8HoSGeeHVg54LGdTWMVj4yU6V up -d  --pull --force-upgrade --confirm-upgrade --stack ${pkg.group}-${pkg.name}-${pkg.version}`

    fs.writeFileSync(`${projectRoot}/.gitlab-ci.yml`, tpl)
    console.log(`File generated: ${projectRoot}/.gitlab-ci.yml`.blue)
  }

  docker() {
    const projectRoot = process.cwd()
    if (fs.existsSync(`${projectRoot}/tik.json`) && fs.existsSync(`${projectRoot}/.env`)) {
      this.dockerCompose()
      this.rancherCompose()
    } else {
      Err(`Project Root Invalid: ${projectRoot}`)
    }
  }

  dockerCompose(){
    const projectRoot = this.projectRoot
    const env = dotenv.load({ path: `${projectRoot}/.env` }).parsed
    const pkg = require(`${projectRoot}/tik.json`)
    pkg.name = formatName(pkg.name)
    const tpl =
      `version: '2'
services:
  ${pkg.name || ''}:
    image: ${pkg.name}:stable
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
    //todo 后续要自动识别服务依赖 加到 external_links
    fs.writeFileSync(`${projectRoot}/docker-compose.yml`, tpl)
    console.log(`File generated: ${projectRoot}/docker-compose.yml`.blue)
  }

  rancherCompose() {
    const projectRoot = this.projectRoot
    const pkg = require(`${projectRoot}/tik.json`)
    pkg.name = formatName(pkg.name)
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
}