# custom-util-format

A customizable version of the [`util.format()`](https://nodejs.org/api/util.html#util_util_format_format) function from the node.js stdlib.

Create a customized `format()` function by passing an object of custom flags. Each key should be a single character flag, and each value a function that formats the argument for that flag. These flags will be merged with the default `s`, `d`, and `j` flags. Pass any falsey value to override them.

## usage
```js
const format = require('custom-util-format')({
  p: x => `${Math.round(x * 100)}%`
})

console.log(format('msg: %p complete', 0.5));
// => 'msg: 50% complete'
```
