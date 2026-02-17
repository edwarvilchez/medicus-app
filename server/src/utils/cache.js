const Redis = require('ioredis');
const logger = require('./logger');

// Redis client configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => {
  logger.info('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  logger.error({ err }, '❌ Redis connection error');
});

/**
 * Cache middleware for Express routes
 * @param {number} duration - Cache duration in seconds (default: 300 = 5 minutes)
 * @param {string} keyPrefix - Optional prefix for cache key
 */
const cacheMiddleware = (duration = 300, keyPrefix = '') => {
  return async (req, res, next) => {
    // Skip caching in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.ENABLE_CACHE) {
      return next();
    }

    const cacheKey = `cache:${keyPrefix}:${req.originalUrl}`;

    try {
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        logger.debug({ path: req.originalUrl }, 'Cache hit');
        return res.json(JSON.parse(cached));
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        redis.setex(cacheKey, duration, JSON.stringify(body))
          .catch(err => logger.error({ err, cacheKey }, 'Failed to cache response'));
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error({ error }, 'Cache middleware error');
      next(); // Continue without caching on error
    }
  };
};

/**
 * Invalidate cache by pattern
 * @param {string} pattern - Pattern to match keys (e.g., 'cache:doctors:*')
 */
const invalidateCache = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.debug({ pattern, keys: keys.length }, 'Cache invalidated');
    }
  } catch (error) {
    logger.error({ error, pattern }, 'Failed to invalidate cache');
  }
};

/**
 * Clear all cache
 */
const clearCache = async () => {
  try {
    await redis.flushdb();
    logger.info('All cache cleared');
  } catch (error) {
    logger.error({ error }, 'Failed to clear cache');
  }
};

module.exports = {
  redis,
  cacheMiddleware,
  invalidateCache,
  clearCache
};
