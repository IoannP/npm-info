// @ts-nocheck
const {
  before,
  after,
  describe,
  test,
} = require('mocha');
const assert = require('assert');
const nock = require('nock');

const fixtures = require('../__fixtures__');
const getPackageInfo = require('../src/index');

let source;

before(async () => {
  source = nock('https://registry.npmjs.org').persist();
});

describe('Test javascript', () => {
  const { data, expected: expectedData } = fixtures.javascript;

  test('Get package info', async () => {
    for (const { input, packageName } of data.matches) {
      source.get(`/${packageName}/latest`).reply(200, data.packages[packageName]);
      const expected = expectedData[packageName];
      const result = await getPackageInfo(input, 'javascript');
      assert.strictEqual(result.value, expected);
    }
  });
});

after(async () => nock.cleanAll());
