# Mappersmith Object

TODO: write!

## Examples

```js
var data = {
  name: "Someone",
  age: 27,
  human: true,
  company: {
    name: "SomethingCool.io",
    sectors: ["1A", "2B"],
    floors: {
      first: "A",
      second: "B"
    }
  }
}

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
  obj.get('company.name') // return == value (the promise is resolved and the value assigned)
})

// FETCH
obj.fetch('name', 'Default Name') // 'Someone'
obj.fetch('wrong', 'Default value') // 'Default value'
obj.fetch('wrong', function() { return 'Default Value'}) // 'Default value'

// RESET()
obj.attributes() // {name: 'Someone', ...}
obj.set('name', 'Name') // 'Name'
obj.attributes() // {name: 'Name', ...}

// RESET() with override
obj.reset({name: 'New', human: false}) // {name: 'New', human: false, ...}
obj.get('name') // 'New'
obj.reset() // {...} original object

// Reset returns the reseted attributes
obj.reset() // {name: 'Someone', ...}
obj.attributes() // {name: 'Someone', ...}

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
```
