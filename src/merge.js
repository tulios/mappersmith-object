function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

// Code based on: https://github.com/jquery/jquery/blob/2.1.4/src/core.js#L124
function merge() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0] || {};
	var length = arguments.length;
	var i = 1;

	// Handle case when target is a string or something
	if (typeof target !== 'object' && !(typeof target === 'function')) {
		target = {};
	}

	for (; i < length; i++) {
		// Only deal with non-null/undefined values
    if ((options = arguments[i]) === null) continue;

		// Extend the base object
		for (name in options) {
		  src = target[name];
			copy = options[name];

			// Prevent never-ending loop
			if (target === copy) continue;

			// Recurse if we're merging plain objects or arrays
			if (copy && (isObject(copy) || (copyIsArray = isArray(copy)))) {
				if (copyIsArray) {
					copyIsArray = false;
					clone = src && isArray(src) ? src : [];

				} else {
					clone = src && isObject(src) ? src : {};
				}

				// Never move original objects, clone them
				target[name] = merge(clone, copy);

		  // Don't bring in undefined values
			} else if (copy !== undefined) {
				target[name] = copy;
			}
		}
	}

	return target;
}

module.exports = merge;
