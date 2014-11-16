var test = require('tape')
var headStream = require('./index')

test('headStream(onHead)', function (t) {
  t.plan(3)

  var stream = headStream(onHead)
  stream.on('data', onData)
  stream.on('end', onEnd)

  stream.write('foo')
  stream.write('bar')
  stream.end()

  function onHead(chunk, callback) {
    t.equal(chunk, 'foo')
    callback()
  }
  function onData(chunk) {
    t.equal(chunk, 'bar')
  }
  function onEnd() {
    t.pass('should end')
    t.end()
  }
})

test('headStream(onHead, { includeHead: true })', function (t) {
  t.plan(4)

  var expected = [ 'foo', 'bar' ]
  var stream = headStream(onHead, { includeHead: true })
  stream.on('data', onData)
  stream.on('end', onEnd)

  stream.write('foo')
  stream.write('bar')
  stream.end()

  function onHead(chunk, callback) {
    t.equal(chunk, 'foo')
    callback()
  }
  function onData(chunk) {
    t.equal(chunk, expected.shift())
  }
  function onEnd() {
    t.deepEqual(expected, [])
    t.end()
  }
})

test('headStream(onHead), onHead errors', function (t) {
  t.plan(1)
  var stream = headStream(onHead, { includeHead: true })
  stream.on('data', onData)
  stream.on('end', onEnd)
  stream.on('error', onError)

  stream.write('foo')
  stream.end()

  function onError(err) {
    t.equal(err.message, 'foobar')
  }
  function onHead(chunk, callback) {
    callback(new Error('foobar'))
  }
  function onData(chunk) {
    t.fail('data event should not be emitted')
  }
  function onEnd() {
    t.end()
  }
})

test('headStream(onHead), onHead errors async', function (t) {
  t.plan(1)
  var stream = headStream(onHead, { includeHead: true })
  stream.on('data', onData)
  stream.on('end', onEnd)
  stream.on('error', onError)

  stream.write('foo')
  stream.end()

  function onError(err) {
    t.equal(err.message, 'foobar')
  }
  function onHead(chunk, callback) {
    setTimeout(function () {
      callback(new Error('foobar'))
    }, 10)
  }
  function onData(chunk) {
    t.fail('data event should not be emitted')
  }
  function onEnd() {
    t.end()
  }
})

test('headStream(onHead)', function (t) {
  t.plan(3)

  var stream = headStream(onHead)
  stream.on('data', onData)
  stream.on('end', onEnd)

  stream.write({ foo: 'bar' })
  stream.write({ hello: 'world' })
  stream.end()

  function onHead(chunk, callback) {
    t.deepEqual(chunk, { foo: 'bar' })
    callback()
  }
  function onData(chunk) {
    t.deepEqual(chunk, { hello: 'world' })
  }
  function onEnd() {
    t.pass('should end')
    t.end()
  }
})
