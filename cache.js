const cache = new Map();
const ttlMap = new Map();

// TODO: Watch youtube video on node-cache
// TODO: Redefine objectives for caching system

const nodeCache = require('node-cache');
const myCache = new nodeCache();

const obj = { my: 'Special', variable: 42 };
const obj2 = { my: 'other special', variable: 1337 };

const success = myCache.mset([
  { key: 'myKey', val: obj },
  { key: 'myOtherKey', val: obj2 },
]);

if (!success) {
  console.error('Failed to set cache');
} else {
  console.log('Cache set');
}

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

function clearCache() {
  cache.clear();
  ttlMap.clear();
}

module.exports = cache;
module.exports = { getCache, setCache, clearCache };
