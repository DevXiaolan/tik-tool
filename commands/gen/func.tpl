async __name__(__argv__){
  if (process.env.NODE_ENV === 'test:local') {
    return __mock__;
  }
  //enums
  const resp = await request({
    uri: `${this.host}__path__`,
    method: '__METHOD__',
    headers: {
      'content-type': 'application/json',
      'appid': this.appid,
      'trace-id': this.traceId,
      //__headers__
    },
    body: __body__,
    qs: __query__,
    timeout: this.timeout || 3000,
    json: true
  })
  if (resp.code!==0){
    throw resp
  }
  return resp.data
}

//__FUNC__