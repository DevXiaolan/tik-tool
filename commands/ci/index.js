const fs = require('fs');
const Err = require('../../utils/error_handler');

module.exports = {
  init: (argv) => {
    const projectRoot = process.cwd();
    const pkg = require(`${projectRoot}/tik.json`);
    const projectType = pkg.type || 'node';

    if (!fs.existsSync(`${__dirname}/class/${projectType}.js`)) {
      Err('project type invalid : ' + projectType);
    }

    const instance = new (require(`./class/${projectType}.js`))(argv);
    instance.init();
  },
  docker: (argv) => {
    const projectRoot = process.cwd();
    const pkg = require(`${projectRoot}/tik.json`);
    const projectType = pkg.type || 'node';

    if (!fs.existsSync(`${__dirname}/class/${projectType}.js`)) {
      Err('project type invalid : ' + projectType);
    }

    const instance = new (require(`./class/${projectType}.js`))(argv);
    instance.docker();
  },
  deps: (argv) => {
    const projectRoot = process.cwd();
    if (!fs.existsSync(`${projectRoot}/swagger.json`)) {
      Err('swagger.json not found!');
    }
    const swagger = require(`${projectRoot}/swagger.json`);
    const routerStr = fs.readFileSync(`${projectRoot}/src/router.js`).toString();
    const matched = routerStr.match(/router.(.*?)\('(.*?)',/g);
    
    if (matched && matched.length) {
      matched.forEach(route => {
        const [,method,,uri] = route.split(/\.|\(|\'/);
        if(!(swagger.paths[uri] && swagger.paths[uri][method])){
          Err(`文档缺失: ${method} ${uri}`);
        }
        //todo 更多的检查
      });
    }
  },
};