const logger = require('./logger');

/**
 * MOCKED Cache middleware - Redis disabled
 */
const cacheMiddleware = (duration = 300, keyPrefix = '') => {
  return async (req, res, next) => {
    // Redis disabled, always proceed to next
    next();
  };
};

/**
 * MOCKED Invalidate cache - Redis disabled
 */
const invalidateCache = async (pattern) => {
  // Do nothing
};

/**
 * MOCKED Clear all cache - Redis disabled
 */
const clearCache = async () => {
  // Do nothing
};

// Mock redis client
const redis = {
  get: async () => null,
  set: async () => {},
  setex: async () => {},
  del: async () => {},
  keys: async () => [],
  flushdb: async () => {},
  on: () => {}
};

module.exports = {
  redis,
  cacheMiddleware,
  invalidateCache,
  clearCache
};
