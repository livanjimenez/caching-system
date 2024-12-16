// * 1. caching strategy
// In-memory caching - node-cache
// easy to implement, fast, but limited by server memory & not persistent
// other options:
// distributed caching - redis, memcached
// HTTP caching - browser caching, CDN caching

// * 2. data to cache
// Frequently accessed data from database (mock data)

// * 3. cache management
// cache invalidation - most commonly used: use cache aside (lazy loading)
// implementation: check cache before querying database (cache hit)
// query database and store result in cache (cache miss)

// * 4. cache eviction
// LRU (Least Recently Used) - remove least recently used items

// TODO: implement cache invalidation strategy
// TODO: implement cache eviction strategy

import { database, cacheMissDatabase } from './mock/database.js';
import NodeCache from 'node-cache';
import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

const cache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

(async () => {
  Object.keys(database.customers).forEach((customerId) => {
    const values = database.customers[customerId].purchaseHistory.items;
    cache.set(customerId, values);
  });

  const cachedKeys = cache.keys();
  cachedKeys.forEach((key) => {
    const cachedValue = cache.get(key);
    console.log(
      `Cached key: ${key}, value: ${JSON.stringify(cachedValue, null, 2)}`,
    );
  });
})();

function cacheAside(req, res, next) {
  const { id } = req.params;

  if (cache.has(id)) {
    console.log('Cache hit');
    const cacheHit = cache.get(id);
    res.locals.data = cacheHit;
    console.log(cache.data);
    return next();
  } else {
    console.log('Cache miss');
    const query = cacheMissDatabase.customers[id]?.purchaseHistory?.items;
    if (query) {
      cache.set(id, query);
      res.locals.data = query;
      return next();
    } else {
      return res.status(404).json({ message: 'Customer not found' });
    }
  }
}

function cacheEviction() {
  // implement LRU cache eviction strategy
  // check if cache is full
  // if full, remove the least recently used item
}

app.get('/customers/:id/purchase-history', cacheAside, (req, res) => {
  return res.status(200).json(res.locals.data);
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
