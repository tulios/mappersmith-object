var Instance = require('./src/instance');

module.exports = {
  create: function(attrs, opts) {
    return new Instance(attrs, opts);
  }
};
