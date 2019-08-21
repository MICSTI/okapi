const commonUtil = require('./index');

const obj = {
  foo: {
    bar: [{
      key: 'name',
      value: 'Michael'
    }, {
      key: 'name',
      value: 'Hans'
    }, {
      key: 'name',
      value: 'Stefon'
    }]
  }
};

const arr = [
  {
    id: 'a',
    name: 'Michael'
  },
  {
    id: 'b',
    name: 'Hans'
  },
  {
    id: 'c',
    name: 'Stefon'
  }
];

test('lookup of nested object values works', () => {
  const path = '/foo/bar/2/value';
  const expectedValue = 'Stefon';

  expect(commonUtil.lookupObjectPathValue(obj, path)).toEqual(expectedValue);
});

test('an error is thrown if something else than an object is passed', () => {
  const noObj = ['a', 'b', 'c'];

  expect(() => commonUtil.lookupObjectPathValue(noObj, 'x')).toThrow();
});

test('lookup of invalid path throws an error', () => {
  const invalidPath = '/foo/baz/1/value';

  expect(() => commonUtil.lookupObjectPathValue(obj, invalidPath)).toThrow();
});

test('lookup of array index for key/value combination works', () => {
  const prop = 'name';
  const value = 'Stefon';
  const expectedIdx = 2;

  expect(commonUtil.lookupArrayElementIdx(arr, prop, value)).toEqual(expectedIdx);
});

test('lookup of array index for key/value combination returns -1 if no matching element is found', () => {
  const prop = 'name';
  const value = 'Anand';
  const expectedIdx = -1;

  expect(commonUtil.lookupArrayElementIdx(arr, prop, value)).toEqual(expectedIdx);
});

test('lookup of array index throws an error if no array is passed', () => {
  const noArray = 'I am no array!';

  expect(() => commonUtil.lookupArrayElementIdx(noArray, 'name', 'Stefon')).toThrow();
})
