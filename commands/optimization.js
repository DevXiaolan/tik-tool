const fs = require('fs');
const { EOL } = require('os');
const colors = require('colors');
const optimization = {};

optimization.detail = (moduleName) => {
  const deps = require(process.cwd() + '/package.json').dependencies || {};
  if (deps[moduleName] === undefined) {
    console.log('You had NOT used : ' + moduleName);
    process.exit(0);
  }
  const requires = getAllRequire(process.cwd());
  console.log(`${moduleName} used detail:${EOL}`.yellow);
  for (const k in requires[moduleName]) {
    console.log(requires[moduleName][k].green);
  }
};

optimization.dependence = () => {

  const deps = require(process.cwd() + '/package.json').dependencies || {};
  for (const k in deps) {
    deps[k] = 0;
  }

  const requires = getAllRequire(process.cwd());

  for (const k in requires) {
    if (deps[k] !== undefined) {
      deps[k] = requires[k].length;
    }
  }
  console.log(('module' + ' '.repeat(32)).substr(0, 32).yellow + 'used'.yellow);
  for (const k in deps) {
    const display = deps[k] === 0 ? deps[k].toString().red + '(never used)'.gray : deps[k].toString().cyan;
    console.log((k + ' '.repeat(32)).substr(0, 32) + display);
  }
};

const getAllRequire = (path) => {
  const result = {};

  if (fs.statSync(path).isDirectory() && !(path.endsWith('node_modules'))) {
    fs.readdirSync(path).map((x) => {
      const next = getAllRequire(path + '/' + x);
      for (const k in next) {
        result[k] = result[k] || [];
        result[k] = result[k].concat(next[k]);
      }

    });

  } else if (path.endsWith('.js')) {
    const content = fs.readFileSync(path).toString();
    const matches = content.match(/require\(['|"](.*?)['|"]\)/g);
    for (const k in matches) {
      const f = matches[k].replace(/require\([\'|"]|[\'|"]\)/g, '');
      let m;
      if (f.startsWith('@')) {
        m = f;
      } else {
        m = f.split('/')[0];
      }
      result[m] = result[m] || [];
      result[m].push(path);
    }
    const matchesImport = content.match(/import[\s+](.*?)[\s+]from[\s+](.*)/g);
    for (const k in matchesImport) {
      const find = matchesImport[k].match(/from[\s+]['|"](.*?)['|"]/);
      if (find) {
        const m = find[1];
        result[m] = result[m] || [];
        result[m].push(path);
      }

    }
  }
  return result;
};

module.exports = optimization;
