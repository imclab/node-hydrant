(function() {
  var zmq;

  zmq = require('zmq');

  module.exports = (function() {

    function exports(config) {
      this.config = config;
      this.sock = zmq.socket('pull');
    }

    exports.prototype.start = function() {
      var _this = this;
      this.sock.connect(this.config.server);
      this.sock.on('error', function(err) {
        return _this.error(err);
      });
      return this.sock.on('message', function(msg) {
        return _this.emit(msg.toString());
      });
    };

    return exports;

  })();

}).call(this);
