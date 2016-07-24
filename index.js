var Instance = require('./src/instance');
var create = function(attrs, opts) {
  return new Instance(attrs, opts);
}

module.exports = {
  create: create,
  extend: function(mixin) {
    return function(attrs, opts) {
      return create(attrs, opts).extend(mixin);
    }
  }
};
