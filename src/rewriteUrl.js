'use strict'

const { URL } = require('url')
const amazonDomainsMap = require('./amazonDomainsMap')

module.exports = function rewriteUrl (url, userCountryCode, defaultCountry = 'US', tagsMap = {}) {
  const preferredSite = amazonDomainsMap[userCountryCode] || amazonDomainsMap[defaultCountry]

  try {
    const u = new URL(url)
    // TODO remove tag
    // TODO add tag for current site (if available)
    // TODO rebuild full url
    // TODO return URL
  } catch (err) {
    return `https://${preferredSite}`
  }
}
