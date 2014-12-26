
var Transform = require('readable-stream/transform')
var Promise = require('native-or-bluebird')
var inherits = require('util').inherits
var assert = require('assert')

module.exports = map

function map(transform, flush) {
  assert(typeof transform === 'function')
  var stream = new Transform({
    objectMode: true
  })
  stream._transform = fnToTransform(transform)
  if (typeof flush === 'function') stream._flush = fnToFlush(flush)
  return stream
}

map.create = function (transform, flush) {
  assert(typeof transform === 'function')

  function Stream(options) {
    if (!(this instanceof Stream)) return new Stream(options)

    options = options || {}
    if (!('objectMode' in options)) options.objectMode = true
    Transform.call(this, options)
  }

  inherits(Stream, Transform)

  Stream.prototype._transform = fnToTransform(transform)
  if (typeof flush === 'function') Stream.prototype._flush = fnToFlush(flush)

  return Stream
}

function fnToTransform(fn) {
  return function (doc, NULL, cb) {
    Promise.resolve(fn.call(this, doc)).then(cb.bind(null, null), cb)
  }
}

function fnToFlush(fn) {
  return function (cb) {
    Promise.resolve(fn.call(this)).then(cb.bind(null, null), cb)
  }
}
