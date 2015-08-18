var Instance = require('./src/instance');

module.exports = {
  Instance: Instance,
  Exceptions: require('./src/exceptions'),
  create: function(attrs, opts) {
    return new Instance(attrs, opts);
  }
};
