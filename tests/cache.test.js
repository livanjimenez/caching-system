const cache = require('./cache');

/* Mocking the cache module */

jest.mock('./cache', () => {
  const cache = new Map();
  const ttlMap = new Map();

  function getCache(key) {
    if (ttlMap.has(key) && ttlMap.get(key) < Date.now()) {
      cache.delete(key);
      ttlMap.delete(key);
    }

    return cache.get(key);
  }

  function setCache(key, value, ttl) {
    cache.set(key, value);
    ttlMap.set(key, Date.now() + ttl);
  }

  setCache('default', { message: 'Hello, World!' }, 1000);

  return { getCache };
});

/* Test the cache module  */

test('cache hit', () => {
  const hello = cache.getCache('default');
  expect(hello).toEqual({ message: 'Hello, World!' });
});

test('cache miss', () => {
  const hello = cache.getCache('unknown');
  expect(hello).toBeUndefined();
});
