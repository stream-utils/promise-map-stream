
var Promise = require('native-or-bluebird')
var toArray = require('stream-to-array')
var assert = require('assert')

var Map = require('..')

it('should map()', function () {
  var i = 0;
  var map = Map(function (doc) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        doc.i = i++
        resolve(doc)
      }, 10)
    })
  }, function () {
    this.push({
      x: 2,
      i: 2
    })
  })

  map.write({
    x: 0
  })

  map.write({
    x: 1
  })

  map.end()

  return toArray(map).then(function (arr) {
    for (var i = 0; i < 3; i++) {
      assert(arr[i].x === i)
      assert(arr[i].i === i)
    }
  })
})

it('should create() a new constructor', function () {
  var Stream = Map.create(function (doc) {
    var self = this
    this.i = this.i || 0
    return new Promise(function (resolve) {
      setTimeout(function () {
        doc.i = self.i++
        resolve(doc)
      }, 10)
    })
  }, function () {
    this.push({
      x: 2,
      i: 2
    })
  })

  var stream = new Stream()

  stream.write({
    x: 0
  })

  stream.write({
    x: 1
  })

  stream.end()

  return toArray(stream).then(function (arr) {
    for (var i = 0; i < 3; i++) {
      assert(arr[i].x === i)
      assert(arr[i].i === i)
    }
  })
})
