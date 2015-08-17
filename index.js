var Instance = require('./src/instance');

module.exports = {
  Instance: Instance,
  create: function(attrs) {
    return new Instance(attrs);
  }
};
