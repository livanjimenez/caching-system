import NodeCache from 'node-cache';
import express from 'express';

// * 1. caching strategy
// In-memory caching - node-cache
// easy to implement, fast, but limited by server memory & not persistent
// other options:
// distributed caching - redis, memcached
// HTTP caching - browser caching, CDN caching

// * 2. data to cache
// Frequently accessed data from database (MySQL)

// * 3. cache management
// cache invalidation - most commonly used: use cache aside (lazy loading)
// implementation: check cache before querying database (cache hit)
// query database and store result in cache (cache miss)

// * 4. cache eviction
// LRU (Least Recently Used) - remove least recently used items

const app = express();
const port = 3000;

const cache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

app.get('/', (req, res) => {});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
