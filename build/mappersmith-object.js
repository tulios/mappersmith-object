(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MappersmithObject = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * MappersmithObject 0.1.0
 * https://github.com/tulios/mappersmith-object
 */
var Instance = require('./src/instance');

module.exports = {
  Instance: Instance,
  Exceptions: require('./src/exceptions'),
  create: function(attrs, opts) {
    return new Instance(attrs, opts);
  }
};

},{"./src/exceptions":2,"./src/instance":3}],2:[function(require,module,exports){
function StrictViolationException() {
  this.message = '[MappersmithObject] This object is configured with "strict: true" and doesn\'t ' +
  ' allow undefined keys';
  this.toString = function() {
    return this.message;
  }
}

module.exports = {
  StrictViolationException: StrictViolationException
}

},{}],3:[function(require,module,exports){
(function (global){
var Mappersmith = (typeof window !== "undefined" ? window['Mappersmith'] : typeof global !== "undefined" ? global['Mappersmith'] : null);
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
    return isDefined(holder) ? holder : opts.default || null;
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

  isBlank: function(stringChain) {
    try {
      var value = this.get(stringChain);
      var objToString = Object.prototype.toString.call(value);
      return value === false ||
             !isDefined(value) ||
             (objToString === '[object Array]' && value.length === 0) ||
             (objToString === '[object String]' && value.length === 0) ||
             (objToString === '[object Number]' && isNaN(value));
    } catch(e) {
      if (e instanceof Exceptions.StrictViolationException) return true;
      else throw e;
    }
  },

  isPresent: function(stringChain) {
    return !this.isBlank(stringChain);
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

  toggle: function(stringChain) {
    var value = this.get(stringChain);
    if (!isDefined(value)) return this.set(stringChain, true);
    if (typeof value === 'boolean') return this.set(stringChain, !value);
    return false
  },

  toArray: function(stringChain) {
    var value = this.get(stringChain);
    if (!isDefined(value)) return [];
    var objToString = Object.prototype.toString.call(value);
    return objToString === '[object Array]' ? value : [value];
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./exceptions":2,"./number":4}],4:[function(require,module,exports){
module.exports = {
  isInteger: Number.isInteger || function(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  }
}

},{}]},{},[1])(1)
});