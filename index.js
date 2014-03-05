var through = require('through')

module.exports = head

function head (onHead, opts) {
  if (!opts) opts = {}
  
  var rest = false
  var ended = false
  var stream = through(write, end)
  
  return stream
  
  function write(chunk) {
    var self = this
    if (rest) return self.queue(chunk)
    self.pause()
    if (opts.includeHead) self.queue(chunk)
    onHead(chunk, function next(err) {
      if (err) {
        self.resume()
        self.emit('error', err)
        return
      }
      rest = true
      self.resume()
      if (ended) self.queue(null)
    })
  }
  
  function end() {
    ended = true
    if (!this.paused) this.queue(null)
  }
}
