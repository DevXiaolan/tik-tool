const createClient = require('redis').createClient

const DEFAULT_PORT = 6379

class Cache {
  constructor() {
    this._client = createClient({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || DEFAULT_PORT,
      db: process.env.REDIS_DB || 0
    })
  }

  async read(id) {
    let result = await this._client.get(id)
    try {
      result = JSON.parse(result)
    } catch (e) {
      //ignore
    }
    return result
  }

  async write(id, content, ex) {
    if (typeof content === 'object') {
      content = JSON.stringify(content)
    }
    if (ex) {
      return this._client.setex(id, ex, content)
    } else {
      return this._client.set(id, content)
    }
  }
}

const cache = new Cache()

module.exports = cache