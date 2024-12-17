const NodeCache = require('node-cache');
const database = require('../mock/database.test');

jest.mock('node-cache', () => {
  return jest.fn().mockImplementation(() => ({
    has: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  }));
});

const cache = new NodeCache();
const cacheAside = jest.fn((req, res, next) => {
  const { id } = req.params;

  if (cache.has(id)) {
    res.locals.data = cache.get(id);
    return next();
  } else {
    const query = database.customers[id]?.purchaseHistory?.items;
    if (query) {
      cache.set(id, query);
      res.locals.data = query;
      return next();
    } else {
      return res.status(404).json({ message: 'Customer not found' });
    }
  }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.locals = {};
  return res;
};

describe('Cache Middleware (mocked)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { id: '1' } };
    res = mockResponse();
    next = jest.fn();

    cache.has.mockReset();
    cache.get.mockReset();
    cache.set.mockReset();
    cache.del.mockReset();
    cache.keys.mockReset();
    cacheAside.mockClear();
  });

  test('should handle cache hit correctly', () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue(database.customers['1'].purchaseHistory.items);

    cacheAside(req, res, next);

    expect(cache.has).toHaveBeenCalledWith('1');
    expect(cache.get).toHaveBeenCalledWith('1');
    expect(res.locals.data).toEqual(
      database.customers['1'].purchaseHistory.items
    );
    expect(next).toHaveBeenCalled();
  });

  test('should handle cache miss and query database', () => {
    cache.has.mockReturnValue(false);

    cacheAside(req, res, next);

    expect(cache.has).toHaveBeenCalledWith('1');
    expect(cache.set).toHaveBeenCalledWith(
      '1',
      database.customers['1'].purchaseHistory.items
    );
    expect(res.locals.data).toEqual(
      database.customers['1'].purchaseHistory.items
    );
    expect(next).toHaveBeenCalled();
  });

  test('should return 404 when customer is not found', () => {
    req.params.id = '999';
    cache.has.mockReturnValue(false);

    cacheAside(req, res, next);

    expect(cache.has).toHaveBeenCalledWith('999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Customer not found' });
    expect(next).not.toHaveBeenCalled();
  });
});
