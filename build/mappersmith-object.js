/*!
 * MappersmithObject 0.4.0
 * https://github.com/tulios/mappersmith-object
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.MappersmithObject=e():t.MappersmithObject=e()}(this,function(){return function(t){function e(n){if(i[n])return i[n].exports;var r=i[n]={exports:{},id:n,loaded:!1};return t[n].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){var n=i(1);t.exports={create:function(t,e){return new n(t,e)}}},function(t,e,i){function n(t){return t&&"object"==typeof t&&t.then}function r(t){return void 0!==t&&null!==t}function o(t){if(this._opts.strict&&void 0===t)throw new u.StrictViolationException}function s(t){console&&console.warn&&console.warn("[MappersmithObject] "+t)}function c(t,e){this._id=++f,this._original=t,this._opts=a({strict:!1},e),this._attributes=null,this._aliases={},this.reset()}var a=i(2),u=i(3),h=i(4).isInteger,f=0;c.prototype={attributes:function(){var t=arguments.length;if(0===t)return a({},this._attributes);for(var e=new c,i=0;i<t;i++){var n=arguments[i];e.set(n,this.get(n))}return e.attributes()},reset:function(){return this._attributes=a({},this._original)},update:function(t){return this._attributes=a(this._attributes,t)},alias:function(t){var e=arguments.length;if(0===e)return a({},this._aliases);var i={};return Object.keys(t||{}).forEach(function(e){this.has(e,{skipAlias:!0})?s('Skipping alias "'+e+'". It is shadowing/hiding an attribute with the same name'):i[e]=t[e]}.bind(this)),this._aliases=a(this._aliases,i),this},get:function(t,e){e=a({"default":null,skipAlias:!1},e);var i=t.split(/\./),n=this._attributes,s=null;if(!e.skipAlias){var c=this._aliases[t];if(c)return this.get(c)}return i.forEach(function(t){t="-1"===t?n.length-1:t,s=r(n)?n[t]:null,o.call(this,s),n=s}.bind(this)),r(s)?s:e["default"]},set:function(t,e){if(n(e))return e.then(function(e){return this.set(t,e)}.bind(this));var i=t.split(/\./),r=this._attributes,s=i.length-1,c=this._aliases[t];return c?this.set(c,e):(i.forEach(function(t,i){i!==s?(r[t]||(o.call(this,r[t]),r[t]={}),r=r[t]):(o.call(this,r[t]),r[t]=e)}.bind(this)),e)},fetch:function(t,e){var i=this.get(t);if(!i){var n="function"==typeof e?e():e;return this.set(t,n)}return i},has:function(t,e){try{return e=a({skipAlias:!1},e),r(this.get(t,e))}catch(i){if(i instanceof u.StrictViolationException)return!1;throw i}},isBlank:function(t){try{var e=this.get(t),i=Object.prototype.toString.call(e);return e===!1||!r(e)||"[object Array]"===i&&0===e.length||"[object String]"===i&&(0===e.length||/^\s+$/g.test(e))||"[object Number]"===i&&isNaN(e)||"[object Object]"===i&&0===Object.keys(e).length}catch(n){if(n instanceof u.StrictViolationException)return!0;throw n}},isPresent:function(t){return!this.isBlank(t)},inc:function(t,e){e=e||1;var i=this.get(t);return r(i)?!!h(i)&&this.set(t,i+e):this.set(t,e)},dec:function(t,e){return this.inc(t,-1*(e||1))},toggle:function(t){var e=this.get(t);return r(e)?"boolean"==typeof e&&this.set(t,!e):this.set(t,!0)},toArray:function(t){var e=t?this.get(t):this.attributes();if(!r(e))return[];var i=Object.prototype.toString.call(e);return"[object Array]"===i?e:[e]},toString:function(){return"<MappersmithObject.Instance:#"+this._id+">"}};var l=Object.keys(c.prototype);l.splice(l.indexOf("toString"),1),c.prototype.extend=function(t){return t=a({},t),Object.keys(t).forEach(function(e){if(["extend"].concat(l).indexOf(e)!==-1)throw new Error('[MappersmithObject] trying to extend object with a reserved method name ("'+e+'")');this[e]=function(){return t[e].apply(this,arguments)}}.bind(this)),this},c.prototype.is=c.prototype.has,t.exports=c},function(t,e){function i(t){return"[object Object]"===Object.prototype.toString.call(t)}function n(t){return"[object Array]"===Object.prototype.toString.call(t)}function r(){var t,e,o,s,c,a,u=arguments[0]||{},h=arguments.length,f=1;for("object"!=typeof u&&"function"!=typeof u&&(u={});f<h;f++)if(null!==(t=arguments[f]))for(e in t)o=u[e],s=t[e],u!==s&&(s&&(i(s)||(c=n(s)))?(c?(c=!1,a=o&&n(o)?o:[]):a=o&&i(o)?o:{},u[e]=r(a,s)):void 0!==s&&(u[e]=s));return u}t.exports=r},function(t,e){function i(){this.message='[MappersmithObject] This object is configured with "strict: true" and doesn\'t  allow undefined keys',this.toString=function(){return this.message}}t.exports={StrictViolationException:i}},function(t,e){t.exports={isInteger:Number.isInteger||function(t){return"number"==typeof t&&isFinite(t)&&Math.floor(t)===t}}}])});