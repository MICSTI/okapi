const cryptoUtil = require('./index');

test('createRandomString returns string with correct length', () => {
  const strLength = 32;
  expect(cryptoUtil.createRandomString(strLength).length).toEqual(strLength);
});

test('hashPassword correctly concatenates passed salt and password and returns SHA512 hash', () => {
  const salt = "kgibpaPfdNnVuuQQLgM1Ew3VvZGGbEHik9y6Ru0f";
  const password = "1234";

  const expectedHash = "KfWo4hMGxbP9IxBuOCI3/2TBQz7EbxlqHS83rBLm9SukMe+xrzwB9LQyKnv2KNawcPx3FzYzCEeAZBmL7jYNbw==";

  expect(cryptoUtil.getPasswordHash(salt, password)).toEqual(expectedHash);
});

test('a string is correctly encoded to Base 64', () => {
  const origin = "Yes! I will be encoded correctly";
  const expectedResult = "WWVzISBJIHdpbGwgYmUgZW5jb2RlZCBjb3JyZWN0bHk=";

  expect(cryptoUtil.encodeBase64(origin)).toEqual(expectedResult);
});

test('a Base 64 encoded string is correctly decoded', () => {
  const encodedString = "WWVzISBJIHdhcyBkZWNvZGVkIGNvcnJlY3RseQ==";
  const expectedResult = "Yes! I was decoded correctly";

  expect(cryptoUtil.decodeBase64(encodedString)).toEqual(expectedResult);
});

test('an object is stringified before being encoded to Base 64', () => {
  const obj = {
    foo: 'bar'
  };

  const stringifiedObj = JSON.stringify(obj);

  const encodedObj = cryptoUtil.encodeBase64(obj);
  const encodedStringifiedObj = cryptoUtil.encodeBase64(stringifiedObj);

  expect(encodedObj).toEqual(encodedStringifiedObj);
});

test('an encoded string is parsed to object if possible', () => {
  const encodedObj = "eyJmb28iOiJiYXIiLCJiYXoiOnsiaWQiOiJ4In19";

  const expectedObj = { foo: "bar", baz: { id: "x" } };

  expect(cryptoUtil.decodeBase64(encodedObj)).toEqual(expectedObj);
});

test('encoding and subsequently decoding a Base 64 string returns the original string', () => {
  const origin = "Today is a fantastic day! Á";

  expect(cryptoUtil.decodeBase64(cryptoUtil.encodeBase64(origin))).toEqual(origin);
});
