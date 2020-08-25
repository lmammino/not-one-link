'use strict'

const { URL } = require('url')
const amazonDomainsMap = require('./amazonDomainsMap')

module.exports = function rewriteUrl (url, userCountryCode, tagsMap = {}) {
  const ucc = typeof userCountryCode === 'string' ? userCountryCode.toUpperCase() : undefined
  const preferredSite = amazonDomainsMap[ucc]

  if (!preferredSite) {
    // if no mapping is available for the given country it keeps the url unchanged
    return url
  }

  const tag = tagsMap[preferredSite]

  const u = new URL(url)
  u.searchParams.delete('tag')
  if (tag) {
    u.searchParams.set('tag', tag)
  }
  u.protocol = 'https:'
  u.host = preferredSite
  return u.toString()
}
