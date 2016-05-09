var MappersmithObject = require('mappersmith-object')
var MO = MappersmithObject.create

var obj = MO({
  name: "Someone",
  age: 27,
  human: true,
  company: {
    name: "SomethingCool.io",
    sectors: ["1A", "2B"],
    floors: { first: "A", second: "B" }
  }
})

console.log(obj.attributes())
console.log(obj.inc('age'))
console.log(obj.get('company.sectors.1'))
