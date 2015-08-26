var merge = require('../src/merge');

describe('#merge', function() {
  it('merge the object attributes', function() {
    var objA = {a: 1, b: 2, e: false};
    var objB = {b: 1, c: 2};
    var objC = {d: [1, 2], e: true}
    var result = merge({}, objA, objB, objC);

    expect(result.a).to.equal(1);
    expect(result.b).to.equal(1);
    expect(result.c).to.equal(2);
    expect(result.d).to.deep.equal([1, 2]);
    expect(result.e).to.equal(true);
  });

  it('merge object keys deeply', function() {
    var objA = {a: {a1: 1, b1: 'yes'}};
    var objB = {a: {a1: 2, c1: false}, b: true, c: 2};
    var objC = {c: {c1: [1, 2]}};
    var result = merge({}, objA, objB, objC);

    expect(result.a).to.deep.equal({a1: 2, b1: 'yes', c1: false});
    expect(result.b).to.equal(true);
    expect(result.c).to.deep.equal({c1: [1, 2]});
  });

  it('ignores undefined values', function() {
    var objA = {a: 1, b: 2};
    var objB = {b: 1, c: undefined};
    var result = merge({}, objA, objB);

    expect(result).to.deep.equal({a: 1, b: 1});
  });
});
