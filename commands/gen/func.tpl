async __name__(__argv__){
  //enums
  const resp = await request({
    uri: `${this.host}__path__`,
    method: '__METHOD__',
    headers: {
      'content-type': 'application/json',
      'trace-id': this.traceId,
      //__headers__
    },
    body: __body__,
    qs: __query__,
    json: true
  })
  if (resp.code!==0){
    throw resp
  }
  return resp.data
}

//__FUNC__