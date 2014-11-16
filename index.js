var through = require('through2')

module.exports = head

function head (onHead, opts) {
  if (!opts) opts = {}
  
  var rest = false
  var ended = false
  var stream = through.obj(write)
  
  return stream
  
  function write(chunk, _, callback) {
    var self = this
    if (rest) return callback(null, chunk)
    onHead(chunk, function next(err) {
      if (err) {
        callback(err)
        return
      }
      if (opts.includeHead) self.push(chunk)
      rest = true
      callback()
    })
  }
}
