import { determineVersionCompatibility } from '../src/core/version-check';

QUnit.module('types-version-utils | determineVersionCompatibility ');

QUnit.test(
  'Newer type versions can be used with older lib versions',
  assert => {
    assert.deepEqual(
      determineVersionCompatibility(
        ['foo', '~3.4.1'],
        ['@types/foo', '~3.8.0'],
        name => (name === 'foo' ? '3.4.6' : '3.8.3')
      ),
      {
        lib: { name: 'foo', target: '~3.4.1', version: '3.4.6' },
        types: { name: '@types/foo', target: '~3.8.0', version: '3.8.3' },
        result: {
          compatibility: 'yes'
        }
      }
    );
  }
);

QUnit.test(
  'Newer type versions cannot be used with older major releases',
  assert => {
    assert.deepEqual(
      determineVersionCompatibility(
        ['foo', '~2.4.1'],
        ['@types/foo', '~3.8.0'],
        name => (name === 'foo' ? '2.4.3' : '3.8.3')
      ),
      {
        lib: { name: 'foo', target: '~2.4.1', version: '2.4.3' },
        types: { name: '@types/foo', target: '~3.8.0', version: '3.8.3' },
        result: {
          compatibility: 'no',
          suggestion: 'Upgrade "foo"',
          reason:
            'Library version (foo@~2.4.1) and types version (@types/foo@~3.8.0) are not compatible'
        }
      }
    );
  }
);

QUnit.test('Absent type definitions are tolerated', assert => {
  assert.deepEqual(
    determineVersionCompatibility(
      ['foo', '~2.4.1'],
      ['@types/foo', null],
      name => (name === 'foo' ? '2.4.4' : null)
    ),
    {
      lib: { name: 'foo', target: '~2.4.1', version: '2.4.4' },
      types: { name: '@types/foo', target: null, version: null },
      result: {
        compatibility: 'yes',
        reason: 'Library "@types/foo" not found in package.json'
      }
    }
  );
});

QUnit.test(
  'A warning is indicated for dependencies tolerant to breaking changes (^X.X.X)',
  assert => {
    assert.deepEqual(
      determineVersionCompatibility(
        ['foo', '~3.4.1'],
        ['@types/foo', '^3.8.0'],
        name => (name === 'foo' ? '3.4.4' : '3.8.3')
      ),
      {
        lib: { name: 'foo', target: '~3.4.1', version: '3.4.4' },
        types: {
          recommendedTarget: '~3.8.3',
          name: '@types/foo',
          target: '^3.8.0',
          version: '3.8.3'
        },
        result: {
          compatibility: 'warn',
          suggestion:
            'Update package.json with dependency { "@types/foo": "~3.8.3" }',
          reason:
            'A type library target of "^3.8.0" will allow your app to take in breaking changes. This is the SemVer equivalent of { "@types/foo": "*" }. See more about ambient type versioning strategy here https://github.com/mike-north/types-version#the-versioning-strategy'
        }
      }
    );
  }
);

QUnit.test(
  'A warning is indicated for dependencies tolerant to breaking changes (*)',
  assert => {
    assert.deepEqual(
      determineVersionCompatibility(
        ['foo', '~3.4.1'],
        ['@types/foo', '*'],
        name => (name === 'foo' ? '3.4.4' : '3.8.3')
      ),
      {
        lib: { name: 'foo', target: '~3.4.1', version: '3.4.4' },
        types: {
          recommendedTarget: '~3.8.3',
          name: '@types/foo',
          target: '*',
          version: '3.8.3'
        },
        result: {
          compatibility: 'warn',
          suggestion:
            'Update package.json with dependency { "@types/foo": "~3.8.3" }',
          reason:
            'A type library target of "*" will allow your app to take in breaking changes. This is the SemVer equivalent of { "@types/foo": "*" }. See more about ambient type versioning strategy here https://github.com/mike-north/types-version#the-versioning-strategy'
        }
      }
    );
  }
);
