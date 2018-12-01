const colors = require('colors');
const { EOL } = require('os');

module.exports = (v) => {
  console.log(`${EOL}${'ERROR:'.red}  ${JSON.stringify(v).yellow}${EOL}`);
  process.exit();
};