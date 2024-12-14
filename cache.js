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

module.exports = cache;
module.exports = { getCache, setCache };
