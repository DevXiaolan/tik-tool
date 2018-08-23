require('dotenv').load('../.env');

process.env.MONGO_DBNAME = 'tikcoin_test';
const { test } = require('ava');
const superkoa = require('superkoa');
const app = require('../app');

const bootup = superkoa(app);

test.cb('demo', t => {
  bootup
    .get('/v1/')
    .expect('Content-Type', /json/)
    .expect(200, (err, res) => {
      t.ifError(err);
      if (res.body.code !== 0) {
        throw new Error(JSON.stringify(res.body));
      }
      t.end();
    });
});
