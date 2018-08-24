import hello from 'types-version-utils';

QUnit.module('types-version-utils tests');

QUnit.test('hello', assert => {
  assert.equal(hello(), 'Hello from types-version-utils');
});
