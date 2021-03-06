(function() {
  var loadFile;

  exports.loadFile = loadFile = function(path, cb) {
    var _this = this;
    switch (path.split(".").slice(-1).toLowerCase()) {
      case "js":
      case "json":
        return fs.readFile(path, function(err, raw) {
          if (err != null) {
            return cb(err, {});
          } else {
            return cb(false, JSON.parse(raw));
          }
        });
      case "yml":
      case "yaml":
        return YAML.readFile(path, function(err, obj) {
          if (err != null) {
            return cb(err, {});
          } else {
            return cb(false, obj[0]);
          }
        });
      default:
        return fs.readFile(path, function(err, raw) {
          if (err != null) {
            return cb(err, {});
          } else {
            return cb(false, ("" + raw).split("\n"));
          }
        });
    }
  };

}).call(this);
