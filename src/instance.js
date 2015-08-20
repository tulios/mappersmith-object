var Mappersmith = require('mappersmith');
var Utils = Mappersmith.Utils;
var Exceptions = require('./exceptions');
var isNumber = require('./number').isInteger;

var objectIDCount = 0;

function isThenable(value) {
  return value && typeof value === 'object' && value.then;
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function checkForStrictViolations(obj) {
  if (this._opts.strict && obj === undefined) {
    throw new Exceptions.StrictViolationException();
  }
}

function Instance(obj, opts) {
  this._id = ++objectIDCount;
  this._original = obj;
  this._opts = Utils.extend({strict: false}, opts);
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
      holder = isDefined(obj) ? obj[method] : null;
      checkForStrictViolations.call(this, holder);
      obj = holder;
    }.bind(this));

    // need to check holder with isDefined because '' (empty string)
    // is treated as a false object. Ex: '' || null => null
    return isDefined(holder) ? holder : null || opts.default;
  },

  set: function(stringChain, value) {
    if (isThenable(value)) {
      return value.
        then(function(result) { return this.set(stringChain, result) }.
        bind(this));
    }

    var isStrict = this._opts.strict;
    var methods = stringChain.split(/\./);
    var obj = this._attributes;
    var last = methods.length - 1;

    methods.forEach(function(method, i) {
      if (i !== last) {
        if (!obj[method]) {
          checkForStrictViolations.call(this, obj[method]);
          obj[method] = {}
        }
        obj = obj[method];

      } else {
        checkForStrictViolations.call(this, obj[method]);
        obj[method] = value;
      }
    }.bind(this));

    return value;
  },

  fetch: function(stringChain, value) {
    var result = this.get(stringChain);
    if (!result) {
      var newValue = (typeof value === 'function') ? value() : value;
      return this.set(stringChain, newValue);
    }

    return result;
  },

  has: function(stringChain) {
    try {
      return isDefined(this.get(stringChain));

    } catch(e) {
      if (e instanceof Exceptions.StrictViolationException) return false;
      else throw e;
    }
  },

  inc: function(stringChain, factor) {
    factor = factor || 1;
    var current = this.get(stringChain);
    if (isDefined(current)) {
      if (isNumber(current)) return this.set(stringChain, current + factor);
      return false;
    }
    return this.set(stringChain, factor);
  },

  dec: function(stringChain, factor) {
    return this.inc(stringChain, -1 * (factor || 1))
  },

  toString: function() {
    return '<MappersmithObject.Instance:#' + this._id + '>';
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
