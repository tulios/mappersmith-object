# Mappersmith Object

__This is a work in progress__

This project is inspired by the `Ember.Object` project, it aims to provide a light layer on top of your objects/responses to help with common annoyances which the javascript world provides daily. It helps you with a common interface to access attributes and really useful helpers to deal with daily problems.

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
- [extend](#extend)

### <a name="create"></a> create

```js
var obj = MappersmithObject.create(data);
// or
var obj = MappersmithObject.create(data, {strict: true});
```

### <a name="attributes"></a> attributes

```js
obj.attributes() // {name: 'Someone', ...}
obj.attributes('name') // {name: 'Someone'}
obj.attributes('name', 'human') // {name: 'Someone', human: true}

obj.attributes('wrong.key', 'company.name')
// {wrong: {key: null}, company: {name: 'SomethingCool.io'}}
```

### <a name="get"></a> get

```js
obj.get('name') // 'Someone'
obj.get('company.name') // SomethingCool.io
obj.get('company.floors.first') // A
obj.get('wrong') // null
obj.get('wrong.chain') // null
obj.get('wrong', {default: 'My Name'}) // 'My Name'
```

with `{strict: true}`:

```js
obj.get('invalid')
// throws MappersmithObject.Exceptions.StrictViolationException
```

### <a name="set"></a> set

```js
obj.set('name', 'Other') // 'Other'
obj.attributes() // {name: 'Other', ...}
obj.set('company.name', 'Name') // 'Name'

obj.set('some.new.key.chain', true) // true
obj.get('some.new.key') // {chain: true}
obj.get('some.new.key.chain') // true

obj.set('company.name', promiseObj) // Promise (will resolve and set)
obj.set('company.name', promiseObj).then(function(value) {
  // value => promise value

  obj.get('company.name')
  // return == value (the promise is resolved and the value assigned)
})
```

with `{strict: true}`:

```js
obj.set('invalid', 'value')
// throws MappersmithObject.Exceptions.StrictViolationException
```

### <a name="fetch"></a> fetch

```js
obj.fetch('name', 'Default Name') // 'Someone'
obj.fetch('wrong', 'Default value') // 'Default value'
obj.fetch('wrong', function() { return 'Default Value'}) // 'Default value'
```

with `{strict: true}`:

```js
obj.fetch('invalid', 'value')
// throws MappersmithObject.Exceptions.StrictViolationException
```

### <a name="has"></a> has

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

```js
obj.inc('clicks') // 4
obj.inc('clicks', 2) // 6
obj.inc('invalid') // 1
obj.inc('name') // false
```

### <a name="dec"></a> dec

```js
obj.dec('clicks') // 5
obj.dec('clicks', 3) // 2
obj.dec('invalid') // -1
obj.dec('name') // false
```

### <a name="toggle"></a> toggle

```js
obj.toggle('human') // false
obj.toggle('human') // true
obj.toggle('invalid') // true
obj.toggle('name') // false
obj.toggle('name') // false
```

### <a name="is-blank"></a> isBlank
// isBlank

### <a name="is-present"></a> isPresent
// isPresent

### <a name="to-array"></a> toArray

```js
obj.toArray('name') // ['Someone']
obj.toArray('age') // [27]
obj.toArray('invalid') // []
obj.toArray('company.sectors') // ["1A", "2B"]
```

### <a name="reset"></a> reset

```js
obj.attributes() // {name: 'Someone', ...}
obj.set('name', 'Name') // 'Name'
obj.attributes() // {name: 'Name', ...}
// Reset returns the original attributes
obj.reset() // {name: 'Someone', ...}
obj.attributes() // {name: 'Someone', ...}
```

with override:

```js
obj.reset({name: 'New', human: false}) // {name: 'New', human: false, ...}
obj.get('name') // 'New'
obj.reset() // {...} original object
```

### <a name="extend"></a> extend

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

## Tests

```sh
npm test
```

## Compile and release

Compile: `npm run build`
Release (minified version): `npm run release`

## License

See [LICENSE](https://github.com/tulios/mappersmith-object/blob/master/LICENSE) for more details.
