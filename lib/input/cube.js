(function() {
  var rest;

  rest = require('restler');

  module.exports = (function() {

    function exports(config) {
      this.config = config;
      this.host = this.config.host;
    }

    exports.prototype.start = function() {
      var metric, name, query, url, _ref,
        _this = this;
      _ref = this.config.metrics;
      for (name in _ref) {
        metric = _ref[name];
        url = this.host + "/1.0/metric";
        url += "?expression=" + metric.expression;
        url += "&start=" + metric.start;
        url += "&stop=" + metric.stop;
        url += "&step=" + metric.step;
      }
      query = rest.get(url);
      query.on('complete', function(data) {
        var value, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          value = data[_i];
          _results.push(_this.emit(data.value));
        }
        return _results;
      });
      return query.on('error', function(err) {
        return _this.error(err);
      });
    };

    return exports;

  })();

}).call(this);
