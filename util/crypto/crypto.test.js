const cryptoUtil = require('./index');

test('createRandomString returns string with correct length', () => {
  const strLength = 32;
  expect(cryptoUtil.createRandomString(strLength).length).toEqual(strLength);
});
