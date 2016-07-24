var MappersmithObject = require('../index');
var Instance = require('../src/instance');

describe('index', function() {
  describe('.create', function() {
    it('returns a new object of Instance', function() {
      var attrs = { name: 'test', age: 2 };
      var instance = MappersmithObject.create(attrs);
      expect(instance).to.not.be.null;
      expect(instance.attributes()).to.deep.equal(attrs);
      expect(instance).to.be.instanceof(Instance);
    });
  });

  describe('.extend', function() {
    var Person, obj, attrs;

    beforeEach(function() {
      Person = MappersmithObject.extend({
        id: function() {
          return this.get('name') + ', age: ' + this.get('age');
        }
      });

      attrs = { name: 'test', age: 2 };
      obj = new Person(attrs);
    });

    it('returns a function which generates new Instance', function() {
      expect(Person).to.be.instanceof(Function);
      expect(obj).to.not.be.null;
      expect(obj.attributes()).to.deep.equal(attrs);
      expect(obj).to.be.instanceof(Instance);
    });

    it('extends the new Instance with provided mixin', function() {
      expect(obj.id).to.be.instanceof(Function);
      expect(obj.id()).to.equal('test, age: 2');
    });
  });
});
