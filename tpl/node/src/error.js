/**
  错误定义规约

  DEMO_NOT_FOUND: {
    code: 404001,
    message: 'fooooo'
  }

  ${ERROR_NAME}: {
    code: ${http_code}${序号},
    message: 'description'
  }

  1.错误码使用 http code + 三位序号 组合， 方便监控系统做搜索和统计
  2.最终输出的到客户端的错误码为 ${APPID}${code} 如： 1001404001,
  3. APPID 在env里定义， APP_ID
  4.ERROR_NAME使用全大写驼峰

 */
module.exports = {
  DEMO_NOT_FOUND: {
    code: 404001,
    message: 'fooooo'
  }
};
