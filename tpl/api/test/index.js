require('dotenv').load('../.env')
const app = require('../app')
const { test } = require('ava')
const superkoa = require('superkoa')

const bootup = superkoa(app)

test.cb('demo', t => {
  bootup
    .get('/v1/')
    .expect('Content-Type', /json/)
    .expect(200, (err, res) => {
      t.ifError(err)
      if (res.body.code !== 0) {
        throw new Error(JSON.stringify(res.body))
      }
      //more cases
      t.end()
    })
})