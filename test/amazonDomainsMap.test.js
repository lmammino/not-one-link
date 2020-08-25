'use strict'

const tap = require('tap')
const amazonDomainsMap = require('../src/amazonDomainsMap')

tap.test('Every item in the map is associated to a non-empty stirng', async t => {
  for (const [key, value] of Object.entries(amazonDomainsMap)) {
    t.type(value, 'string', `Value at key ${key} is not a string`)
    t.assert(value.trim() !== '', `Value at key ${key} is an empty string`)
  }
})
