'use strict'

const tap = require('tap')
const rewriteUrl = require('../src/')

tap.test('It maps links to correct amazon sites for user country', async t => {
  const url = 'https://www.amazon.com/Node-js-Design-Patterns-production-grade-applications/dp/1839214112/ref=sr_1_1?crid=2I9IDQ7A0CFD9&dchild=1&keywords=nodejs+design+patterns+3rd+edition&qid=1598358916&s=books&sprefix=nodejs+design+p%2Cstripbooks-intl-ship%2C344&sr=1-1'
  t.sameStrict(rewriteUrl(url, 'IT'), url.replace('amazon.com', 'amazon.it'))
  t.sameStrict(rewriteUrl(url, 'it'), url.replace('amazon.com', 'amazon.it'))
  t.sameStrict(rewriteUrl(url, 'ES'), url.replace('amazon.com', 'amazon.es'))
  t.sameStrict(rewriteUrl(url, 'es'), url.replace('amazon.com', 'amazon.es'))
  t.sameStrict(rewriteUrl(url, 'DE'), url.replace('amazon.com', 'amazon.de'))
  t.sameStrict(rewriteUrl(url, 'de'), url.replace('amazon.com', 'amazon.de'))
})

tap.test('If no mapping is available for the given country, it keeps the original url unchanged', async t => {
  const url = 'https://www.amazon.com/Node-js-Design-Patterns-production-grade-applications/dp/1839214112/ref=sr_1_1?crid=2I9IDQ7A0CFD9&dchild=1&keywords=nodejs+design+patterns+3rd+edition&qid=1598358916&s=books&sprefix=nodejs+design+p%2Cstripbooks-intl-ship%2C344&sr=1-1'
  t.sameStrict(rewriteUrl(url, 'BZ'), url)
})

tap.test('If no user country is passed, it keeps the original url unchanged', async t => {
  const url = 'https://www.amazon.com/Node-js-Design-Patterns-production-grade-applications/dp/1839214112/ref=sr_1_1?crid=2I9IDQ7A0CFD9&dchild=1&keywords=nodejs+design+patterns+3rd+edition&qid=1598358916&s=books&sprefix=nodejs+design+p%2Cstripbooks-intl-ship%2C344&sr=1-1'
  t.sameStrict(rewriteUrl(url), url)
})

tap.test('If there are tags available for the destination country it will swap the tag', async t => {
  const tagsMap = {
    'www.amazon.co.uk': 'myUKTag',
    'www.amazon.es': 'myESTag',
    'www.amazon.it': 'myITTag'
  }

  const url = 'https://www.amazon.com/Node-js-Design-Patterns-production-grade-applications/dp/1839214112/ref=sr_1_1?crid=2I9IDQ7A0CFD9&dchild=1&keywords=nodejs+design+patterns+3rd+edition&qid=1598358916&s=books&sprefix=nodejs+design+p%2Cstripbooks-intl-ship%2C344&sr=1-1'
  t.contains(rewriteUrl(url, 'GB', tagsMap), '&tag=myUKTag')
  t.contains(rewriteUrl(url, 'ES', tagsMap), '&tag=myESTag')
  t.contains(rewriteUrl(url, 'IT', tagsMap), '&tag=myITTag')
})

tap.test('If an invalid URL is given it throws a TypeError exception', async t => {
  t.throws(() => rewriteUrl('/dp/1839214112', 'GB'), 'Invalid URL: /dp/1839214112/')
})
