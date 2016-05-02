'use strict';

const inspect = require('util').inspect;
const defaultRules = {
  d: Number,
  s: String,
  j: inspect
}

/**
 * source: https://github.com/nodejs/node/blob/9f8d0ea6db2ff88422d1df69dbfed1dc766f8dbc/lib/util.js
 */
module.exports = function formatFactory(overrides) {
  const rules = Object.assign({}, defaultRules, overrides);

  Object.keys(rules).forEach(name => {
    if (name.length !== 1) {
      throw new Error(`Rule name "${name}" must be one character.`);
    }

    if (rules[name] && typeof rules[name] !== 'function') {
      throw new Error(`Rule value for "${name}" must be a function or falsey, got ${inspect(rules[name])}.`);
    }
  })

  return function format(f) {
    if (typeof f !== 'string') {
      const objects = new Array(arguments.length);
      for (var index = 0; index < arguments.length; index++) {
        objects[index] = inspect(arguments[index]);
      }
      return objects.join(' ');
    }

    var argLen = arguments.length;

    if (argLen === 1) return f;

    var str = '';
    var a = 1;
    var lastPos = 0;
    for (var i = 0; i < f.length;) {
      const char = f.charAt(i)
      if (char === '%' && i + 1 < f.length) {
        const nchar = f.charAt(i + 1)

        if (rules.hasOwnProperty(nchar)) {
          if (a >= argLen)
            break;

          if (lastPos < i)
            str += f.slice(lastPos, i);

          str += rules[nchar](arguments[a++]);
          lastPos = i = i + 2;
          continue;
        }

        if (nchar === '%') {
          if (lastPos < i)
            str += f.slice(lastPos, i);
          str += '%';
          lastPos = i = i + 2;
        }
      }
      ++i;
    }

    if (lastPos === 0)
      str = f;
    else if (lastPos < f.length)
      str += f.slice(lastPos);
    while (a < argLen) {
      const x = arguments[a++];
      if (x === null || (typeof x !== 'object' && typeof x !== 'symbol')) {
        str += ' ' + x;
      } else {
        str += ' ' + inspect(x);
      }
    }
    return str;
  }
}
