# head-stream

Passthrough stream for acting upon the first buffer emitted in a stream. Like the head command of e.g. head and tail, first and rest.

[![NPM](https://nodei.co/npm/head-stream.png)](https://nodei.co/npm/head-stream/)

### usage

Pipe a stream to it, as well as a callback, and that callback will be called with the first buffer like so:

```
someStream.pipe(headStream(onFirstRow)).pipe(someOtherStream)

function onFirstRow(buffer, done) {
  // do stuff with buffer
  done() // tells head-stream to start emitting data downstream
}
```

Until you call `done()`, `someOtherStream` won't receive any data.

You can also pass in options:

```
var options = {includeHead: true}
someStream.pipe(headStream(onFirstRow, opts)).pipe(someOtherStream)
```

`includeHead` means that `someOtherStream` will receive all the buffers that were written to head-stream. By default the first header is not included.

