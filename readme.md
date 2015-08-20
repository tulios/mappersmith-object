# Mappersmith Object

__This is a work in progress__

TODO: write!

## Examples

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

var MappersmithObject = require('mappersmith-object');
var obj = MappersmithObject.create(data);

// ATTRIBUTES()
obj.attributes() // {name: 'Someone', ...}
obj.attributes('name') // {name: 'Someone'}
obj.attributes('name', 'human') // {name: 'Someone', human: true}

obj.attributes('wrong.key', 'company.name')
// {wrong: {key: null}, company: {name: 'SomethingCool.io'}}

// GET
obj.get('name') // 'Someone'
obj.get('company.name') // SomethingCool.io
obj.get('company.floors.first') // A
obj.get('wrong') // null
obj.get('wrong.chain') // null
obj.get('wrong', {default: 'My Name'}) // 'My Name'

// -- strict: true
var obj = MappersmithObject.create(data, {strict: true});
obj.get('invalid')
// throws MappersmithObject.Exceptions.StrictViolationException

// SET
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

// -- strict: true
var obj = MappersmithObject.create(data, {strict: true});
obj.set('invalid', 'value')
// throws MappersmithObject.Exceptions.StrictViolationException

// FETCH
obj.fetch('name', 'Default Name') // 'Someone'
obj.fetch('wrong', 'Default value') // 'Default value'
obj.fetch('wrong', function() { return 'Default Value'}) // 'Default value'

// -- strict: true
var obj = MappersmithObject.create(data, {strict: true});
obj.fetch('invalid', 'value')
// throws MappersmithObject.Exceptions.StrictViolationException

// HAS
obj.has('name') // true
obj.has('company.floors') // true
obj.has('invalid') // false
obj.has('company.invalid.chain') // false

// -- strict: true
obj.has('invalid') // false (no exception in this case)

// RESET()
obj.attributes() // {name: 'Someone', ...}
obj.set('name', 'Name') // 'Name'
obj.attributes() // {name: 'Name', ...}
// Reset returns the original attributes
obj.reset() // {name: 'Someone', ...}
obj.attributes() // {name: 'Someone', ...}

// RESET() with override
obj.reset({name: 'New', human: false}) // {name: 'New', human: false, ...}
obj.get('name') // 'New'
obj.reset() // {...} original object

// EXTEND()
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

// INC and DEC
obj.inc('clicks') // 4
obj.inc('clicks', 2) // 6
obj.dec('clicks') // 5
obj.dec('clicks', 3) // 2

obj.inc('invalid') // 1
obj.dec('invalid') // -1
obj.inc('name') // false
obj.dec('name') // false

// TOGGLE
obj.toggle('human') // false
obj.toggle('human') // true
obj.toggle('invalid') // true
obj.toggle('name') // false
obj.toggle('name') // false

// isBlank
// isPresent
```
