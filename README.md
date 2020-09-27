# not-one-link

[![npm version](https://badge.fury.io/js/not-one-link.svg)](https://badge.fury.io/js/not-one-link)
[![CI](https://github.com/lmammino/not-one-link/workflows/CI/badge.svg)](https://github.com/lmammino/not-one-link/actions?query=workflow%3ACI)
[![codecov](https://codecov.io/gh/lmammino/not-one-link/branch/master/graph/badge.svg)](https://codecov.io/gh/lmammino/not-one-link)

A simple Node.js library that allows you to re-map Amazon links from one country to another (Like Amazon OneLink™️ but simpler to use)


## Rationale

If you want to direct your users to a product page on Amazon and you have an international audience, chances are that you would like to send users from UK to amazon.co.uk, users from Italy to amazon.it and so on...

As far as I am aware the only viable option to do this today is Amazon OneLink™️.

If you have tried to setup Amazon OneLink™️, you have probably been frustrated with the long process and chances are that, in the end, it didn't work for you. Or if it did work for you, you probably already realised that your links won't work with a URL-shortner or in any external website like Twitter or YouTube.

This library is born with the intent to help you to implement your own self-hosted Amazon OneLink™️ alternative.


## Installation and usage

Install it using npm:

```bash
npm install --save not-one-link
```

Example usage:

```javascript
const rewriteUrl = require('not-one-link')

rewriteUrl('https://www.amazon.com/dp/1839214112/', 'UK') // -> https://www.amazon.co.uk/dp/1839214112/
```


## API

The `rewriteUrl` accepts the following parameters:

 - `url` the original Amazon URL you want to rewrite (generally a product url from amazon.com)
 - `userCountryCode` the detected country code of the user you want to redirect to an Amazon page (in [ISO 3166 alpha-2](https://www.iban.com/country-codes) format)
 - `tagsMap` (optional) a map of amazon domains and Amazon affiliate tags. If used it will rewrite the URL by replacing/inserting the correct affiliate tag for the destination website. (See an example [below](#use-with-affiliate-tags))

 **NOTE**: if an invalid URL is passed, the function will throw a `TypeError`, make sure you handle this potential error in your code.


## Use with affiliate tags

If you are using Amazon affiliates, most likely you have created affilaited tags for different countries (unfortunately, as of today you can't have the same tag on different Amazon websites). If you provide the map of your tags per amazon domain, the library will automatically insert/replace the tags for you.

Let's see an example:

```javascript
const rewriteUrl = require('not-one-link')

const tagsMap = {
  'www.amazon.co.uk': 'myUKTag',
  'www.amazon.es': 'myESTag',
  'www.amazon.it': 'myITTag'
}

const url = 'https://www.amazon.com/dp/1839214112/'
rewriteUrl(url, 'UK', tagsMap) // -> https://www.amazon.co.uk/dp/1839214112/?tag=myUKTag
rewriteUrl(url, 'ES', tagsMap) // -> https://www.amazon.es/dp/1839214112/?tag=myESTag
rewriteUrl(url, 'IT', tagsMap) // -> https://www.amazon.it/dp/1839214112/?tag=myITTag
```


## Detecting the user country

This library does not make any assumption on how you want to detect the user country. For instance you might have registered users and the user themselves might have provided their preferred country. Providing this business logic is entirely left to you based on your use cases.

Anyway, a common way to detect a visitor country might be by IP address using something like GeoLite MaxMind DB and [mmdb-reader](https://npm.im/mmdb-reader). If you have a GeoLite database file you could detect a country for a given IP as follows:

```javascript
const MMDBReader = require('mmdb-reader')

const reader = new MMDBReader('path/to/your/GeoLite2-Country.mmdb')
const res = reader.lookup('<the user ip here>')
console.log(res.country.iso_code)
```


## Running this code on a Lambda on AWS?

If you are thinking about doing something like this, this is totally doable, in fact, you can check out [`not-one-link-lambda`](https://github.com/lmammino/not-one-link-lambda).


## Creating a URL rewriting web server

If you want to create a webserver that you can use as a proxy to redirect people to their nearest amazon store you could write something like this:

```javascript
const { createServer } = require('http')
const { URL } = require('url')
const rewriteUrl = require('not-one-link')
const MMDBReader = require('mmdb-reader')

const reader = new MMDBReader('path/to/your/GeoLite2-Country.mmdb')
const server = createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const amazonUrl = requestUrl.searchParams.get('url')
  if (!amazonUrl) {
    res.statusCode = 400
    return res.end('Invalid request, `url` querystring parameter not provided')
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const lookupRes = reader.lookup(ip)
  if (!lookupRes) {
    // if cannot find a match for the user ip returns the original url
    res.statusCode = 302
    res.setHeader('Location', amazonUrl)
    return res.end()
  }

  const userCountry = lookupRes.country.iso_code

  try {
    const redirectUrl = rewriteUrl(amazonUrl, userCountry)
    res.statusCode = 302
    res.setHeader('Location', redirectUrl)
    return res.end()
  } catch (err) {
    res.statusCode = 400
    return res.end('Invalid `url` queryString provided')
  }
})

server.listen(8080)
```

Now you can use the URL https://yourwebsite:8080?url=https%3A%2F%2Fwww.amazon.com%2Fdp%2F1839214112%3Ftag%3Dloige0e-20


## Contributing

Everyone is very welcome to contribute to this project. You can contribute just by submitting bugs or
suggesting improvements by [opening an issue on GitHub](https://github.com/lmammino/not-one-link/issues).

You can also submit PRs as long as you adhere with the code standards and write tests for the proposed changes.

## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
