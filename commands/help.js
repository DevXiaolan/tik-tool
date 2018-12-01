const xiaolanAst = require('xiaolan-ast');
const path = require('path');
const colors = require('colors');
const { EOL } = require('os');

module.exports = (argv) => {
  const entrance = path.resolve(__dirname + '/../index.js');
  let helpers = xiaolanAst.genHelper(entrance);
  if (argv._[0]) {
    helpers = {
      [argv._[0]]: helpers[argv._[0]]
    };
  }
  for (const k in helpers) {
    const help = helpers[k];
    printHelper(help);
  }
};

function printHelper(helper) {
  console.log(`${helper.name.yellow}  ${helper.desc}${EOL}Usage:${EOL}  ${helper.usage.cyan}${EOL}`);
}