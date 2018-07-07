const fs = require('fs')
const Err = require('../../utils/error_handler')

module.exports = {
  init: (argv) => {
    const projectRoot = process.cwd()
    const pkg = require(`${projectRoot}/tik.json`)
    const projectType = pkg.type || 'node'

    if (!fs.existsSync(`${__dirname}/class/${projectType}.js`)) {
      Err('project type invalid : ' + projectType)
    }

    const instance = new (require(`./class/${projectType}.js`))(argv)
    instance.init()
  },
  docker: (argv) => {
    const projectRoot = process.cwd()
    const pkg = require(`${projectRoot}/tik.json`)
    const projectType = pkg.type || 'node'

    if (!fs.existsSync(`${__dirname}/class/${projectType}.js`)) {
      Err('project type invalid : ' + projectType)
    }

    const instance = new (require(`./class/${projectType}.js`))(argv)
    instance.docker()
  },
}