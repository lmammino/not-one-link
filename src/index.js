var MMDBReader = require('mmdb-reader')

// Load synchronously
var reader = new MMDBReader('data/GeoLite2-Country.mmdb')

const res = reader.lookup('2a02:8084:81a1:5680:438:3b5d:4c5d:a752')

console.log(res)
