/**
 * 
 */
const fs = require('fs');
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
      return;
    }
    const env = fs.readFileSync(`${projectRoot}/.env`).toString().split(EOL);
    const envExample = [];
    for (const k in env) {
      const kv = env[k].split('=');
      if (kv[1] === undefined) {
        envExample.push(kv[0]);
        continue;
      }
      envExample.push(kv[0] + '=' + kv[1]);
    }
    fs.writeFileSync(`${projectRoot}/.env.example`, envExample.join(EOL));
    console.log(`File generated: ${projectRoot}/.env.example`.blue);
  }
};