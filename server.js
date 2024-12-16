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

import { database } from './mock/database.js';
import NodeCache from 'node-cache';
import express from 'express';

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

const cache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

(async () => {
  Object.keys(database.customers).forEach((customerId) => {
    cache.set(
      customerId,
      database.customers[customerId].purchaseHistory.items[0]
    );
  });
})();

app.get('/customers/:id/purchase-history', (req, res) => {
  const { id } = req.params;

  // Check the cache for the customer's data
  const cachedData = cache.get(id);
  if (cachedData) {
    console.log(`Cache hit for customer ${id}`);
    console.log(cachedData);
    return res.status(200).json(cachedData);
  }

  // Cache miss: Fetch from database and store in cache
  console.log(`Cache miss for customer ${id}`);
  const customerData = database.customers[id]?.purchaseHistory?.items;

  if (customerData) {
    cache.set(id, customerData);
    return res.status(200).json(customerData);
  } else {
    return res.status(404).json({ message: 'Customer not found' });
  }
});

app.post('/customers', (req, res) => {
  const { customerId, purchaseHistory } = req.body;

  if (!customerId || !purchaseHistory) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  database.customers[customerId] = { customerId, purchaseHistory };
  cache.set(customerId, purchaseHistory.items); // Update cache

  return res.status(201).json({
    message: 'Customer added',
    customer: database.customers[customerId],
  });
});

app.put('/customers/:id/purchase-history', (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  if (!items) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  if (!database.customers[id]) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  database.customers[id].purchaseHistory.items = items;
  cache.set(id, items); // Update cache

  return res.status(200).json({ message: 'Purchase history updated', items });
});

app.delete('/customers/:id', (req, res) => {
  const { id } = req.params;

  if (!database.customers[id]) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  delete database.customers[id];
  cache.del(id); // Remove from cache

  return res.status(200).json({ message: `Customer ${id} deleted` });
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
