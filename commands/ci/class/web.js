const dotenv = require('dotenv')
const { EOL } = require('os')
const fs = require('fs')
const Err = require('../../../utils/error_handler')
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
    const tpl = `stages:
  - buildwebpack
  - builddocker
  - deploy
  - report

job_build_webpack_master:
  stage: buildwebpack
  image: registry.cn-hangzhou.aliyuncs.com/tik/node:tik
  cache:
    untracked: true
    key: \${CI_COMMIT_REF_SLUG}
    policy: push
  script:
    - npm install --registry=https://registry.npm.taobao.org
    - npm run build
    - rm -fr node_modules
    - cp .env.example .env
    - tik docker
  only:
    - master
  artifacts:
    name: \${CI_COMMIT_REF_SLUG}
    paths: 
      - dist
      - docker-compose.yml
      - rancher-compose.yml
    expire_in: 10 mins
  variables:
    TIME_STAMP: ${Date.now()}
${(env => {
        let output = ``
        for (const k in env) {
          if(k==='NODE_ENV'){
            env[k] = 'development'
          }
          output += `    ${k}: ${env[k] || '""'}${EOL}`
        }
        return output
      })(env)}

job_build_webpack_release:
  stage: buildwebpack
  image: registry.cn-hangzhou.aliyuncs.com/tik/node:tik
  cache:
    untracked: true
    key: \${CI_COMMIT_REF_SLUG}
    policy: push
  script:
    - NODE_ENV=development npm install --registry=https://registry.npm.taobao.org
    - npm run build
    - ls
    - rm -fr node_modules
    - cp .env.example .env
    - tik docker
  only:
    - /^release.*$/
  artifacts:
    name: \${CI_COMMIT_REF_SLUG}
    paths: 
      - dist
    expire_in: 10 mins
  variables:
    TIME_STAMP: ${Date.now()}
${(env => {
        let output = ``
        for (const k in env) {
          if(k==='NODE_ENV'){
            env[k] = 'production'
          }
          output += `    ${k}: ${env[k] || '""'}${EOL}`
        }
        return output
      })(env)}

job_build_docker_master:
  stage: builddocker
  image: gitlab/dind
  cache:
    untracked: true
    key: \${CI_COMMIT_REF_SLUG}
    policy: pull
  only:
    - master
  script:
    - docker build -t ${pkg.name}:stable .
    - docker login --username=tik-admin@tik registry.cn-hangzhou.aliyuncs.com -p g423QuHLvqrRTY37
    - docker tag ${pkg.name}:stable registry.cn-hangzhou.aliyuncs.com/tik/${pkg.group}-${pkg.name}:stable
    - docker push registry.cn-hangzhou.aliyuncs.com/tik/${pkg.group}-${pkg.name}:stable
    - rm -fr node_modules
  dependencies:
    - job_build_webpack_master  

job_build_docker_release:
  stage: builddocker
  image: gitlab/dind
  cache:
    untracked: true
    key: \${CI_COMMIT_REF_SLUG}
    policy: pull
  only:
    - /^release.*$/
  script:
    - docker build -t ${pkg.name}:${pkg.version} .
    - docker login --username=tik-admin@tik registry.cn-hangzhou.aliyuncs.com -p g423QuHLvqrRTY37
    - docker tag ${pkg.name}:${pkg.version} registry.cn-hangzhou.aliyuncs.com/tik/${pkg.group}-${pkg.name}:${pkg.version}
    - docker push registry.cn-hangzhou.aliyuncs.com/tik/${pkg.group}-${pkg.name}:${pkg.version}
    - rm -fr node_modules
  dependencies:
    - job_build_webpack_release  

job_deploy:
  stage: deploy
  image: registry.cn-hangzhou.aliyuncs.com/dev_tool/rancher-cli
  cache:
    untracked: true
    key: \${CI_COMMIT_REF_SLUG}
    policy: pull
  only:
    - master
  dependencies:
    - job_build_webpack_master
  script:
    - rm -f ~/.rancher/cli.json
    - rm -fr node_modules
    - rancher --url http://172.20.160.7:8080/v2-beta --access-key A7B232C96113121C64A2 --secret-key 8mAJL2iDVr7k5BT7Ws32h41MyfJY1ubWBGBAM8Ub up -d  --pull --force-upgrade --confirm-upgrade --stack ${pkg.group}-${pkg.name}
    
job_report:
  stage: report
  image: registry.cn-hangzhou.aliyuncs.com/tik/node:tik
  cache:
    untracked: true
    key: \${CI_COMMIT_REF_SLUG}
    policy: pull-push
  when: on_failure
  script:
    - curl https://oapi.dingtalk.com/robot/send?access_token=4b6c67515042a6f16ff5799eedf77231ccb785cd1842c28c73c2dd8499113d2f -XPOST -H 'content-type:application/json' -d '{"msgtype":"text","text":{"content":"[${pkg.group}-${pkg.name}] Job Failed. Link:http://172.20.160.7:10080/${pkg.group}/${pkg.name}/pipelines"}}'
  
`

    fs.writeFileSync(`${projectRoot}/.gitlab-ci.yml`, tpl)
    console.log(`File generated: ${projectRoot}/.gitlab-ci.yml`.blue)
  }

  docker() {
    const projectRoot = process.cwd()
    if (fs.existsSync(`${projectRoot}/tik.json`)) {
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
    image: registry.cn-hangzhou.aliyuncs.com/tik/${pkg.group}-${pkg.name}:stable
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