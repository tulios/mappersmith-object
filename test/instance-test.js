var Promise = require('promise');
var Mappersmith = require('mappersmith');
var Utils = Mappersmith.Utils;

var MappersmithObject = require('../index');
var Instance = MappersmithObject.Instance;
var Exceptions = MappersmithObject.Exceptions;

describe('Instance', function() {
  var instance, attributes;

  beforeEach(function() {
    attributes = {
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
    };

    instance = new Instance(attributes);
  });

  it('can be initialized without arguments', function() {
    expect(new Instance()).to.not.be.null;
  });

  describe('#get', function() {
    it('returns the attribute value', function() {
      expect(instance.get('name')).to.equal(attributes.name);
    });

    it('returns a chain value', function() {
      expect(instance.get('company.floors.first')).to.equal(attributes.company.floors.first);
    });

    it('can return a default value', function() {
      expect(instance.get('company.wrong_key', {default: 'value'})).to.equal('value');
    });

    it('returns null for invalid attribute', function() {
      expect(instance.get('invalid')).to.equal(null);
    });

    it('returns null for invalid chain', function() {
      expect(instance.get('invalid.long.chain.of.attributes')).to.equal(null);
    });

    describe('for javascript "falsy" values', function() {
      it('can return empty strings ("")', function() {
        instance.set('test-key', '');
        expect(instance.get('test-key')).to.equal('');
      });

      it('can return zero number (0)', function() {
        instance.set('test-key', 0);
        expect(instance.get('test-key')).to.equal(0);
      });

      it('can return negative zero number (-0)', function() {
        instance.set('test-key', -0);
        expect(instance.get('test-key')).to.equal(-0);
      });

      it('can return false', function() {
        instance.set('test-key', false);
        expect(instance.get('test-key')).to.equal(false);
      });

      it('can return NaN', function() {
        instance.set('test-key', NaN);
        expect(isNaN(instance.get('test-key'))).to.equal(true);
      });
    });
  });

  describe('#has', function() {
    it('works with simple keys', function() {
      expect(instance.has('name')).to.equal(true);
    });

    it('works with chains', function() {
      expect(instance.has('company.floors.first')).to.equal(true);
    });

    it('returns false for invalid keys', function() {
      expect(instance.has('invalid')).to.equal(false);
    });

    it('returns false for invalid chains', function() {
      expect(instance.has('some.invalid.chain')).to.equal(false);
    });

    describe('for javascript "falsy" values', function() {
      it('returns true for empty strings ("")', function() {
        instance.set('test-key', '');
        expect(instance.has('test-key')).to.equal(true);
      });

      it('returns true for zero number (0)', function() {
        instance.set('test-key', 0);
        expect(instance.has('test-key')).to.equal(true);
      });

      it('returns true for negative zero number (-0)', function() {
        instance.set('test-key', -0);
        expect(instance.has('test-key')).to.equal(true);
      });

      it('returns true for false value', function() {
        instance.set('test-key', false);
        expect(instance.has('test-key')).to.equal(true);
      });

      it('returns true for NaN', function() {
        instance.set('test-key', NaN);
        expect(instance.has('test-key')).to.equal(true);
      });
    });
  });

  describe('#set', function() {
    it('changes the attribute and returns the value', function() {
      var newName = 'New Name';
      expect(instance.set('name', newName)).to.equal(newName);
      expect(instance.get('name')).to.equal(newName);
    });

    it('changes the attribute in a chain', function() {
      var newSecondFloor = '3D';
      expect(instance.set('company.floors.second', newSecondFloor)).to.equal(newSecondFloor);
      expect(instance.get('company.floors.second')).to.equal(newSecondFloor);
    });

    it('creates new attributes', function() {
      var lastName = 'Last Name';
      expect(instance.get('lastname')).to.equal(null);
      expect(instance.set('lastname', lastName)).to.equal(lastName);
      expect(instance.get('lastname')).to.equal(lastName);
    });

    it('creates a new chain', function() {
      var newAttrValue = 7;
      expect(instance.get('a.b.c.d.e.value')).to.equal(null);
      expect(instance.set('a.b.c.d.e.value', newAttrValue)).to.equal(newAttrValue);
      expect(instance.get('a.b.c.d.e.value')).to.equal(newAttrValue);
    });

    describe('with "thenable" value', function() {
      it('returns a promise that resolves the value', function(done) {
        var rawValue = 'promise-value';
        var promise = Promise.resolve(rawValue);

        try {
          instance.set('name', promise).then(function(result) {
            expect(result).to.equal(rawValue);
            expect(instance.get('name')).to.equal(rawValue);
            done();
          }).catch(function(err) {
            done(err);
          });

        } catch(e) {
          done(e.message);
        }
      });
    });
  });

  describe('#fetch', function() {
    describe('chain without value', function() {
      it('assigns value and returns', function() {
        var newValue = 2;
        expect(instance.fetch('some.key', newValue)).to.equal(newValue);
        expect(instance.get('some.key')).to.equal(newValue);
      });

      describe('and value is a function', function() {
        it('calls the function and assign', function() {
          var rawValue = 3;
          var newValue = function() { return rawValue };
          expect(instance.fetch('some.key', newValue)).to.equal(rawValue);
          expect(instance.get('some.key')).to.equal(rawValue);
        });
      });

      describe('and value is a "thenable"', function() {
        it('resolves the value', function(done) {
          var rawValue = 'promise-value';
          var promise = Promise.resolve(rawValue);

          try {
            instance.fetch('some.key', promise).then(function(result) {
              expect(result).to.equal(rawValue);
              expect(instance.get('some.key')).to.equal(rawValue);
              done();
            }).catch(function(err) {
              done(err);
            });

          } catch(e) {
            done(e.message);
          }
        });
      });
    });

    describe('chain with value', function() {
      it('returns value', function() {
        expect(instance.fetch('name', 'other value')).to.equal(instance.get('name'));
      });
    });
  });

  describe('#attributes', function() {
    it('copies the initial attributes', function() {
      expect(instance.attributes()).to.deep.equal(attributes);
      expect(instance.attributes()).to.not.equal(attributes);
    });

    it('returns the modified data', function() {
      var newAttributes = Utils.extend({}, attributes, {name: 'New Name'});
      instance.set('name', 'New Name');
      expect(instance.attributes()).to.deep.equal(newAttributes);
    });

    describe('with arguments', function() {
      it('filters the returned object', function() {
        var result = {name: 'Someone', human: true};
        expect(instance.attributes('name', 'human')).to.deep.equal(result);
      });

      it('allows chain values', function() {
        var result = {new: {value: null}, company: {floors: {first: "A", second: "B"}}};
        expect(instance.attributes('new.value', 'company.floors')).to.deep.equal(result);
      });
    });
  });

  describe('#reset', function() {
    it('restores the original state of the object', function() {
      instance.set('name', 'Other');
      instance.set('age', 1);
      instance.set('new.keys', false);
      expect(instance.attributes()).to.not.deep.equal(attributes);
      expect(instance.reset()).to.deep.equal(attributes);
      expect(instance.attributes()).to.deep.equal(attributes);
    });

    it('overrides the attributes with the object argument', function() {
      var finalObject = Utils.extend({}, attributes, {name: 'New', age: 30});
      expect(instance.reset({name: 'New', age: 30})).to.deep.equal(finalObject);
      expect(instance.attributes()).to.deep.equal(finalObject);
    });

    describe('after override', function() {
      it('can reset to initial values', function() {
        expect(instance.reset({name: 'Wrong'})).to.not.deep.equal(attributes);
        expect(instance.get('name')).to.equal('Wrong');
        expect(instance.reset()).to.deep.equal(attributes);
        expect(instance.attributes()).to.deep.equal(attributes);
      });
    });
  });

  describe('#extend', function() {
    var extendReturn;

    beforeEach(function() {
      extendReturn = instance.extend({
        greetings: function(prefix) {
          prefix = prefix || 'Hello';
          return prefix + ' ' + this.get('name');
        },

        countSectors: function() {
          return this.get('company.sectors').length;
        }
      });
    });

    it('defines the new methods', function() {
      expect(typeof instance.greetings).to.equal('function');
      expect(typeof instance.countSectors).to.equal('function');
    });

    it('uses the instance scope inside the new methods', function() {
      expect(instance.greetings()).to.equal('Hello ' + instance.get('name'));
      expect(instance.countSectors()).to.equal(instance.get('company.sectors').length);
    });

    it('returns the instance', function() {
      expect(extendReturn).to.equal(instance);
    });

    it('forwards arguments', function() {
      expect(instance.greetings('Hey')).to.equal('Hey ' + instance.get('name'));
    });

    [
      'get',
      'set',
      'fetch',
      'attributes',
      'reset',
      'extend'
    ].forEach(function(method) {
      it('protects reserved methods (' + method + ')', function(done) {
        var mixin = {};
        mixin[method] = function(){};

        try { instance.extend(mixin); done(new Error('it shouldn\'t allow to override ' + method)); }
        catch(e) { expect(e).to.not.be.nil; done(); }
      });
    });

    it('allows multiple calls to extend', function() {
      instance.extend({
        anotherMethod: function() { return 'static' }
      });

      expect(typeof instance.anotherMethod).to.equal('function');
      expect(instance.anotherMethod()).to.equal('static');
    });
  });

  describe('with "strict: true"', function() {
    var invalidKey, invalidChain;

    beforeEach(function() {
      instance = new Instance(attributes, {strict: true});
      invalidKey = 'invalid';
      invalidChain = 'company.a.b.c.d';
    });

    describe('#get', function() {
      it('throws error for invalid keys (undefined)', function(done) {
        try {
          instance.get(invalidKey);
          done(new Error('it shouldn\'t allow invalid keys in strict mode'));

        } catch(e) {
          expect(e instanceof Exceptions.StrictViolationException).to.equal(true);
          done();
        }
      });

      it('throws error for invalid chain (undefined)', function(done) {
        try {
          instance.get(invalidChain);
          done(new Error('it shouldn\'t allow invalid chains in strict mode'));

        } catch(e) {
          expect(e instanceof Exceptions.StrictViolationException).to.equal(true);
          done();
        }
      });
    });

    describe('#has', function() {
      it('returns false for invalid keys', function() {
        expect(instance.has(invalidKey)).to.equal(false);
      });

      it('returns false for invalid chains', function() {
        expect(instance.has(invalidChain)).to.equal(false);
      });
    });

    describe('#set', function() {
      it('throws error for invalid keys (undefined)', function(done) {
        try {
          instance.set(invalidKey, 1);
          done(new Error('it shouldn\'t allow invalid keys in strict mode'));

        } catch(e) {
          expect(e instanceof Exceptions.StrictViolationException).to.equal(true);
          done();
        }
      });

      it('throws error for invalid chain (undefined)', function(done) {
        try {
          instance.set(invalidChain, 1);
          done(new Error('it shouldn\'t allow invalid chain in strict mode'));

        } catch(e) {
          expect(e instanceof Exceptions.StrictViolationException).to.equal(true);
          done();
        }
      });
    });

    describe('#fetch', function() {
      it('throws error for invalid keys (undefined)', function(done) {
        try {
          instance.fetch(invalidKey, 1);
          done(new Error('it shouldn\'t allow invalid keys in strict mode'));

        } catch(e) {
          expect(e instanceof Exceptions.StrictViolationException).to.equal(true);
          done();
        }
      });

      it('throws error for invalid chain (undefined)', function(done) {
        try {
          instance.fetch(invalidChain, 1);
          done(new Error('it shouldn\'t allow invalid keys in strict mode'));

        } catch(e) {
          expect(e instanceof Exceptions.StrictViolationException).to.equal(true);
          done();
        }
      });
    });
  });

  describe('#toString', function() {
    it('returns a human readable string', function() {
      expect(instance.toString()).to.equals('<MappersmithObject.Instance:#' + instance._id + '>');
    });

    it('returns a different value each object', function() {
      var another = new Instance();
      expect(instance.toString()).to.not.equal(another.toString());
      expect(instance.toString()).to.equal(instance.toString());
    });
  });
});
