[![Build Status](https://travis-ci.org/tulios/mappersmith-object.svg?branch=master)](https://travis-ci.org/tulios/mappersmith-object)
# Mappersmith Object

This project is inspired by the `Ember.Object` project, it aims to provide a light layer on top of your objects/responses to help with common annoyances which the javascript world provides daily. It helps you with a common interface to access attributes and really useful helpers to deal with daily problems.

This project carries the name `mappersmith-` because it was planned to deeply integrate with [Mappersmith](https://github.com/tulios/mappersmith) project, but this is no longer true, this project doesn't require Mappersmith anymore and can be used standalone.

## Browser support

This project was designed considering modern browsers. However, all the methods used can be included by polyfills.

## Install

__NPM__

```sh
npm install mappersmith-object
```

__Browser__

Download the tag/latest version from the build folder

__Build from the source__

```sh
npm install
npm run release
```

## Features

Assuming the following data:

```js
var data = {
  name: "Someone",
  age: 27,
  human: true,
  clicks: 3,
  company: {
    name: "SomethingCool.io",
    sectors: ["1A", "2B"],
    floors: {
      first: "A",
      second: "B"
    }
  }
}
```

and the following `require`:

```js
var MappersmithObject = require('mappersmith-object');
```

__Table of Contents:__
- [create](#create)
- [attributes](#attributes)
- [get](#get)
- [set](#set)
- [fetch](#fetch)
- [has](#has)
- [inc](#inc)
- [dec](#dec)
- [toggle](#toggle)
- [isBlank](#is-blank)
- [isPresent](#is-present)
- [toArray](#to-array)
- [reset](#reset)
- [update](#update)
- [extend](#extend)

### <a name="create"></a> create

This method is used to wrap your objects. With `strict: true` operations with undefined attributes will raise an exception.

```js
var obj = MappersmithObject.create(data);
// or
var obj = MappersmithObject.create(data, {strict: true});
```

### <a name="attributes"></a> attributes

Returns a plain javascript object with your attributes.

```js
obj.attributes() // {name: 'Someone', ...}
```

It accepts a list of keys to filter the result.

```js
obj.attributes('name') // {name: 'Someone'}
obj.attributes('name', 'human') // {name: 'Someone', human: true}

obj.attributes('wrong.key', 'company.name')
// {wrong: {key: null}, company: {name: 'SomethingCool.io'}}
```

It will raise exception for invalid keys in strict mode.

### <a name="get"></a> get

Retrieves the value of a property from the object. It accepts chain calls.

```js
obj.get('name') // 'Someone'
obj.get('company.name') // SomethingCool.io
obj.get('company.floors.first') // A
obj.get('wrong') // null
obj.get('wrong.chain') // null
```

It's possible to assign a `default` value.

```js
obj.get('wrong', {default: 'My Name'}) // 'My Name'
```

It will raise exception for invalid keys in strict mode.

```js
obj.get('invalid')
// throws MappersmithObject.Exceptions.StrictViolationException
```

### <a name="set"></a> set

Sets the provided value to the key, creating inexistent nodes in the process.

```js
obj.set('name', 'Other') // 'Other'
obj.set('company.name', 'Name') // 'Name'
obj.attributes() // {name: 'Other', company: {name: 'Name', ...}, ...}
```

With inexistent keys/chains:

```js
obj.set('some.new.key.chain', true) // true
obj.get('some.new.key') // {chain: true}
obj.get('some.new.key.chain') // true
```

If the value assigned is a promise it will be resolved and the value set. A promise will be returned instead of the value.

```js
obj.set('company.name', promiseObj) // Promise (will resolve and set)
obj.set('company.name', promiseObj).then(function(value) {
  console.log(value) // value => promise value

  obj.get('company.name')
  // return == value (the promise is resolved and the value assigned)
})
```

It will raise exception for invalid keys in strict mode.

```js
obj.set('invalid', 'value')
// throws MappersmithObject.Exceptions.StrictViolationException
```

### <a name="fetch"></a> fetch

Fetches data from the object, using the given key. If there is data in the object with the given key, then that data is returned. If there is no such data in the object, then the second argument value will be set and returned.

The second argument can be a value or a function. The function will be executed to generate the value.

```js
obj.fetch('name', 'Default Name') // 'Someone'
obj.fetch('wrong', 'Default value') // 'Default value'
obj.fetch('wrong', function() { return 'Default Value'}) // 'Default value'
```

It will raise exception for invalid keys in strict mode.

```js
obj.fetch('invalid', 'value')
// throws MappersmithObject.Exceptions.StrictViolationException
```

### <a name="has"></a> has

It checks if a property exists. It won't raise any exception for invalid keys, even in strict mode.

```js
obj.has('name') // true
obj.has('company.floors') // true
obj.has('invalid') // false
obj.has('company.invalid.chain') // false
```

with `{strict: true}`:

```js
obj.has('invalid') // false (no exception in this case)
```

### <a name="inc"></a> inc

Set the value of a property to the current value plus some amount. The default amount is `1`. If the value is not a number `false` will be returned instead. Undefined keys will be initialized with `1`.

```js
obj.inc('clicks') // 4
obj.inc('clicks', 2) // 6
obj.inc('invalid') // 1
obj.inc('name') // false
```

It will raise exception for invalid keys in strict mode.

### <a name="dec"></a> dec

Set the value of a property to the current value minus some amount. The default amount is `1`. If the value is not a number `false` will be returned instead. Undefined keys will be initialized with `-1`.

```js
obj.dec('clicks') // 5
obj.dec('clicks', 3) // 2
obj.dec('invalid') // -1
obj.dec('name') // false
```

It will raise exception for invalid keys in strict mode.

### <a name="toggle"></a> toggle

```js
obj.toggle('human') // false
obj.toggle('human') // true
obj.toggle('invalid') // true
obj.toggle('name') // false
obj.toggle('name') // false
```

### <a name="is-blank"></a> isBlank

A value is blank if it's `false`, `null`, `undefined`, empty, `NaN` or a whitespace string. For example, `''`, `' '`, `null`, `undefined`, `[]`, and `{}` are all blank.

```js
obj.isBlank('invalid') // true

// imagine {test1: '', test2: ' a ', test3: {}}
obj.isBlank('invalid') // true
obj.isBlank('test1') // true
obj.isBlank('test2') // false
obj.isBlank('test3') // true
```

It will return true for invalid keys in strict mode.

### <a name="is-present"></a> isPresent

A value is present if it's not blank.

```js
obj.isPresent('name') // true
obj.isPresent('invalid') // false
```

It will return false for invalid keys in strict mode.

### <a name="to-array"></a> toArray

Converts the value to an array. If the value is already an array, the same value will be returned. For `undefined` or `null` values a blank array (`[]`) will be returned.

```js
obj.toArray('name') // ['Someone']
obj.toArray('age') // [27]
obj.toArray('invalid') // []
obj.toArray('company.sectors') // ["1A", "2B"]
```

It will raise exception for invalid keys in strict mode.

### <a name="reset"></a> reset

Resets the attributes to the original value.

```js
obj.attributes() // {name: 'Someone', ...}
obj.set('name', 'Thor') // 'Thor'
obj.attributes() // {name: 'Thor', ...}

obj.reset() // {name: 'Someone', ...}
obj.attributes() // {name: 'Someone', ...}
```

### <a name="update"></a> update

Deeply update the attributes.

```js
obj.update({name: 'New', human: false}) // {name: 'New', human: false, ...}
obj.get('name') // 'New'
obj.attributes() // {name: 'New', human: false, ...}
```

### <a name="extend"></a> extend

Merges the content into the object. This method provides a way to enhance the object with mixins/modules. `extend` can be called several times, the methods can be overridden within the next calls.

```js
obj.extend({
  greetings: function() {
    return 'Hello ' + this.get('name');
  },
  sectorCountPlus: function(factor) {
    return this.get('company.sectors') + factor;
  }
}) // will return (this) obj

obj.greetings() // 'Hello Someone'
obj.sectorCountPlus(3) // 2 + 3 = 5
```

It's possible to call `extend` several times.

```js
var LogMixin = {
  info: function() {
    console.log.apply(this, arguments);
  }
}

var ToJsonMixin = {
  toJsonString: function() {
    return JSON.stringify(this.attributes());
  }
}

obj.extend(LogMixin).extend(ToJsonMixin);

obj.info('message');
obj.toJsonString();
```

## Tests

```sh
npm test
```

## Compile and release

Compile: `npm run build`

Release (minified version): `npm run release`

## License

See [LICENSE](https://github.com/tulios/mappersmith-object/blob/master/LICENSE) for more details.
