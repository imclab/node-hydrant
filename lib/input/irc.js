(function() {
  var Client, error, inspect, log, _ref;

  Client = require('irc').Client;

  _ref = require("daizoru-toolbox"), log = _ref.log, error = _ref.error;

  inspect = require('util').inspect;

  module.exports = (function() {

    function exports(config) {
      this.config = config;
    }

    exports.prototype.start = function() {
      var params;
      params = this.config;
      delete params.botname;
      delete params.config;
      this.api = new Client(this.config.network, this.config.botname, params);
      this.api.addListener('error', function(msg) {
        return this.error("" + msg.command + ": " + (msg.args.join(' ')));
      });
      this.bot.addListener('message', function(from, to, msg) {
        console.log('%s => %s: %s', from, to, msg);
        if (to.match(/^[#&]/)) {
          if (msg.match(/hello/i)) send(2000, bot.say(to, 'Hello'));
          if (msg.match(/hydrant/)) {
            return send(2000, bot.say(to, "Hello, " + from + "."));
          } else {
            return this.emit({
              source: this.id,
              foo: "bar",
              date: "foo",
              text: msg
            });
          }
        } else {
          return console.log("received private msg:" + msg);
        }
      });
      this.bot.addListener('pm', function(nick, msg) {
        return console.log('Got private message from %s: %s', nick, msg);
      });
      this.bot.addListener('join', function(channel, who) {
        return console.log('%s has joined %s', who, channel);
      });
      this.bot.addListener('part', function(channel, who, reason) {
        return console.log('%s has left %s: %s', who, channel, reason);
      });
      return this.bot.addListener('kick', function(channel, kicked, kicker, reason) {
        return console.log('%s was kicked from %s by %s: %s', kicked, channel, kicker, reason);
      });
    };

    return exports;

  })();

}).call(this);
