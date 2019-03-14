/**
 * 
 */
const fs = require('fs');
const dotenv = require('dotenv');
const shell = require('shelljs');
const Err = require('../../../utils/error_handler');
const { EOL } = require('os');

module.exports = class CIBase {
  constructor(argv) {
    this.argv = argv;
    this.projectRoot = process.cwd();
  }

  init() {
    if (fs.existsSync(`${this.projectRoot}/tik.json`)) {
      this.syncEnv();
      this.gitlabCI();
    } else {
      Err(`Project Root Invalid: ${this.projectRoot}`);
    }
  }

  gitlabCI() {
    Err('gitlabCI() Not Implements');
  }

  docker() {
    Err('docker() Not Implements');
  }

  dockerCompose() {
    Err('dockerCompose() Not Implements');
  }

  rancherCompose() {
    Err('rancherCompose() Not Implements');
  }

  syncEnv() {
    const projectRoot = this.projectRoot;
    if (!fs.existsSync(`${projectRoot}/.env`)) {
      shell.cp(`${projectRoot}/.env.example`,`${projectRoot}/.env`);
    }
    const envOld = dotenv.load({
      path: `${projectRoot}/.env.example`
    }).parsed;

    const env = fs.readFileSync(`${projectRoot}/.env`).toString().split(EOL);
    const envExample = [];
    for (const k in env) {
      const kv = env[k].split('=');
      if (kv[0].startsWith('#') || kv[0] === '') {
        continue;
      }
      envOld[kv[0]] = kv[1] || '';
    }
    for (let k in envOld) {
      envExample.push(`${k}=${envOld[k]}`);
    }
    fs.writeFileSync(`${projectRoot}/.env.example`, envExample.join(EOL));
    console.log(`File generated: ${projectRoot}/.env.example`.blue);
  }
};