(function() {
  var DataSift;

  DataSift = require('datasift');

  module.exports = (function() {

    function exports(config) {
      this.config = config;
      this.c = new DataSift(this.config.username, this.config.api_key);
    }

    exports.prototype.start = function() {
      var _this = this;
      this.c.connect();
      this.c.on("connect", function() {
        var channel, _i, _len, _ref, _results;
        console.log("Connected!");
        _ref = this.config(channels);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          channel = _ref[_i];
          _results.push(this.c.subscribe(channel));
        }
        return _results;
      });
      this.c.on("error", function(err) {
        return _this.error(err.message);
      });
      this.c.on("warning", function(msg) {
        return _this.error("warning: " + msg);
      });
      this.c.on("disconnect", function() {
        return _this.error("Disconnected!");
      });
      this.c.on("interaction", function(data) {
        return _this.emit(JSON.stringify(data));
      });
      return this.c.on("delete", function(data) {
        return console.log("Delete: " + (JSON.stringify(data)));
      });
    };

    return exports;

  })();

}).call(this);
