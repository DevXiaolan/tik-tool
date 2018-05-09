module.exports = function commonFiledPlugin(schema) {
  schema.add({
    // 创建时间
    createdAt: {
      type: Number,
      default: Date.now()
    },
    // 修改时间
    updatedAt: {
      type: Number,
      default: Date.now()
    },
    // 删除时间
    deletedAt: {
      type: Number,
      default: Date.now()
    },
    status: {
      type: Number,
      // -1 删除，0 无效， 1有效
      default: 1,
      enum: [-1, 0, 1]
    },
    // 去掉__v
    __v: {
      type: Number,
      select: false
    }
  })
  schema.pre('save', function(next){
    this.updatedAt = Date.now()
    next()
  })
}