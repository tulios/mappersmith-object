var Mappersmith = require('mappersmith');
var Utils = Mappersmith.Utils;

function isThenable(value) {
  return value && typeof value === 'object' && value.then;
}

var Instance = function(obj) {
  this._original = obj;
  this._attributes = null;
  this.reset();
}

Instance.prototype = {
  attributes: function() {
    var argumentsLength = arguments.length;
    if (argumentsLength === 0) return this._attributes;
    var output = new Instance();

    for (var i = 0; i < argumentsLength; i++) {
      var attr = arguments[i];
      output.set(attr, this.get(attr));
    }

    return output.attributes();
  },

  reset: function(override) {
    return this._attributes = Utils.extend({}, this._original, override || {});
  },

  get: function(stringChain, opts) {
    opts = Utils.extend({default: null}, opts);
    var methods = stringChain.split(/\./);
    var obj = this._attributes;
    var holder = null;

    methods.forEach(function(method) {
      holder = obj ? obj[method] : null;
      obj = holder;
    }.bind(this));

    return holder || opts.default;
  },

  set: function(stringChain, value) {
    if (isThenable(value)) {
      return value.
        then(function(result) { return this.set(stringChain, result) }.
        bind(this));
    }

    var methods = stringChain.split(/\./);
    var obj = this._attributes;
    var last = methods.length - 1;

    methods.forEach(function(method, i) {
      if (i !== last) {
        if (!obj[method]) obj[method] = {}
        obj = obj[method];

      } else {
        obj[method] = value;
      }
    });

    return value;
  },

  fetch: function(stringChain, value) {
    var result = this.get(stringChain);
    if (!result) {
      var newValue = (typeof value === 'function') ? value() : value;
      return this.set(stringChain, newValue);
    }

    return result;
  }
}

var signature = Object.keys(Instance.prototype);

Instance.prototype.extend = function(mixin) {
  mixin = Utils.extend({}, mixin);
  Object.keys(mixin).forEach(function(key) {
    if (['extend'].concat(signature).indexOf(key) !== -1) {
      throw new Error(
        '[MappersmithObject] trying to extend object with a reserved method name ("' + key + '")'
      );
    }

    this[key] = function() {
      return mixin[key].apply(this, arguments)
    }
  }.bind(this));
  return this;
}

module.exports = Instance;
