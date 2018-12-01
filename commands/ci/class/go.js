const dotenv = require('dotenv');
const { EOL } = require('os');
const fs = require('fs');
const Err = require('../../../utils/error_handler');
const { formatName } = require('../../../utils/func');
const Base = require('./base');

module.exports = class Go extends Base{
  constructor(argv){
    super(argv);
    this.env = dotenv.load({ path: `${this.projectRoot}/.env` }).parsed;
  }
};