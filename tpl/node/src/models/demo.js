const mongoose = require('mongoose');
const commonField = require('../../utils/common_field');

const Schema = new mongoose.Schema({
  //
});

// 公共字段
Schema.plugin(commonField);

module.exports = mongoose.model('demo', Schema);
