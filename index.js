var through = require('through2')

module.exports = head

function head (onHead, opts) {
  if (!opts) opts = {}
  
  var rest = false
  var ended = false
  var stream = through.obj(write, end)
  
  return stream
  
  function write(chunk, _, callback) {
    var self = this
    if (rest) return callback(null, chunk)
    self.pause()
    onHead(chunk, function next(err) {
      if (err) {
        self.resume()
        // self.emit('error', err)
        callback(err)
        self.push(null)
        return
      }
      if (opts.includeHead) self.push(chunk)
      rest = true
      self.resume()
      if (ended) self.push(null)
        callback()
    })
  }
  
  function end() {
    ended = true
    if (!this.paused) this.push(null)
  }
}
