(function() {
  var j5;

  j5 = require("johnny-five");

  module.exports = (function() {

    function exports(config) {
      var conf, name, _ref;
      this.config = config;
      this.board = new j5.Board();
      this.sensors = {};
      _ref = this.config.sensors;
      for (name in _ref) {
        conf = _ref[name];
        this.sensors[name] = new j5.Sensor({
          pin: conf.pin,
          freq: conf.freq
        });
      }
    }

    exports.prototype.start = function() {
      var _this = this;
      return this.board.on("ready", function() {
        var name, sensor, _ref, _results;
        _this.board.repl.inject(_this.sensors);
        _ref = _this.sensors;
        _results = [];
        for (name in _ref) {
          sensor = _ref[name];
          _results.push(sensor.scale(_this.sensors[name].scale).on("read", function() {
            return _this.emit("{sensor: " + name + ", normalized: " + _this.normalized + ", scaled: " + _this.scaled + "}");
          }));
        }
        return _results;
      });
    };

    return exports;

  })();

}).call(this);
