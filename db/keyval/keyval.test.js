const store = require('./index');

test('store must be initialized before setting value', () => {
  expect(() => {
    store.set('foo', 'bar');
  }).toThrow();
});

test('store must be initialized before getting value', () => {
  expect(() => {
    store.get('foo');
  }).toThrow();
});

test('set value is returned upon get', async () => {
  await store.init();
  store.set('foo', 'bar');
  expect(store.get('foo')).toEqual('bar');
});

test('unsetting of keys works', async () => {
  store.unset('foo');
  expect(store.get('foo')).toEqual(undefined);
});
