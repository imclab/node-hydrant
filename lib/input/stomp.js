(function() {
  var stomp, sys;

  sys = require("util");

  stomp = require("stomp");

  module.exports = (function() {

    function exports(config) {
      var conf, k, v, _ref;
      this.config = config;
      conf = {
        port: 61613,
        host: "localhost",
        debug: false,
        login: "guest",
        passcode: "guest",
        prefetchSize: 10,
        queue: '/queue/test_stomp'
      };
      _ref = this.config;
      for (k in _ref) {
        v = _ref[k];
        conf[k] = v;
      }
      this.config = conf;
      this.client = new stomp.Stomp(conf);
      this.headers = {
        destination: conf.queue,
        ack: "client",
        "activemq.prefetchSize": conf.prefetchSize
      };
    }

    exports.prototype.start = function() {
      this.messages = 0;
      this.client.connect();
      this.client.on("connected", function() {
        this.client.subscribe(this.headers);
        return this.emit("Connected");
      });
      this.client.on("message", function(message) {
        this.emit("Got message: " + this.message.headers['message-id']);
        this.client.ack(this.message.headers["message-id"]);
        return this.messages++;
      });
      this.client.on("error", function(error_frame) {
        this.error(error_frame.body);
        return this.client.disconnect();
      });
      return process.on("SIGINT", function() {
        this.console.log("\nConsumed " + this.messages + " messages");
        return this.client.disconnect();
      });
    };

    return exports;

  })();

}).call(this);
