const request = require('request-promise')

class __Name__ {
  constructor(traceId, options={}) {
    this.appid = process.env.APP_ID
    this.host = process.env.__NAME___HOST
    this.traceId = traceId
    this.timeout = options.API_TIMEOUT || 3000
  }

  async ping() {
    let resp
    try {
      resp = await request({
      uri: `${this.host}/ping`,
      method: 'get',
      headers: {
          'content-type': 'application/json',
          'appid': this.appid,
          'trace-id': this.traceId
          //__headers__
        },
        qs: {},
        timeout: this.timeout || 3000,
        json: true
      });
    } catch(e) {
      return {
        error: `${this.host} off line`
      }
    }
    return resp.data;
  }

  //__FUNC__
}

module.exports = __Name__