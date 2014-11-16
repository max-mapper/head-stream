var through = require('through2')

module.exports = head

function head (onHead, opts) {
  if (!opts) opts = {}
  
  var rest = false
  var ended = false
  var stream = through.obj(write)
  
  return stream
  
  function write(chunk, _, cb) {
    var self = this
    if (rest) return cb(null, chunk)
    onHead(chunk, function next(err) {
      if (err) {
        cb(err)
        return
      }
      if (opts.includeHead) self.push(chunk)
      rest = true
      cb()
    })
  }
}
