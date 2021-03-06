(function() {
  var graphiteFormatDate, graphiteParse, rest;

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
        url = this.host + "/render?format=raw";
        url += "?target=alias(" + metric.expression + ",'')";
        url += "&from=" + metric.start;
        url += "&until=" + metric.stop;
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

  graphiteFormatDate = function(time) {
    return Math.floor(time / 1000);
  };

  graphiteParse = function(text) {
    var a, b, c, i, meta, start, step;
    i = text.indexOf("|");
    meta = text.substring(0, i);
    c = meta.lastIndexOf(",");
    b = meta.lastIndexOf(",", c - 1);
    a = meta.lastIndexOf(",", b - 1);
    start = meta.substring(a + 1, b) * 1000;
    step = meta.substring(c + 1) * 1000;
    return text.substring(i + 1).split(",").slice(1).map(function(d) {
      return +d;
    });
  };

  /* Shamelessly forked from cubism.js
  cubism_contextPrototype.graphite = (host) ->
    host = ""  unless arguments.length
    source = {}
    context = this
    source.metric = (expression) ->
      context.metric ((start, stop, step, callback) ->
        d3.text host + "/render?format=raw" + "&target=" + encodeURIComponent("alias(" + expression + ",'')") + "&from=" + cubism_graphiteFormatDate(start - 2 * step) + "&until=" + cubism_graphiteFormatDate(stop - 1000), (text) ->
          return callback(new Error("unable to load data"))  unless text
          callback null, cubism_graphiteParse(text)
      ), expression += ""
  
    source.find = (pattern, callback) ->
      d3.json host + "/metrics/find?format=completer" + "&query=" + encodeURIComponent(pattern), (result) ->
        return callback(new Error("unable to find metrics"))  unless result
        callback null, result.metrics.map((d) ->
          d.path
        )
  
    source.toString = ->
      host
  
    source
  */

}).call(this);
