// Redis client stub - replace with ioredis when Redis is available
// import Redis from 'ioredis';
// import { env } from './env';
// import { logger } from '../utils/logger';

// export const redis = new Redis(env.REDIS_URL, {
//   retryStrategy: (times) => Math.min(times * 50, 2000),
// });

// redis.on('connect', () => logger.info('✅ Redis connected'));
// redis.on('error', (err) => logger.error('Redis error:', err));

// For now, export a simple in-memory store as Redis substitute
export const redis = {
  store: new Map<string, { value: string; expiry?: number }>(),

  async set(key: string, value: string, _mode?: string, ttl?: number): Promise<void> {
    const expiry = ttl ? Date.now() + ttl * 1000 : undefined;
    this.store.set(key, { value, expiry });
  },

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  },

  async del(key: string): Promise<void> {
    this.store.delete(key);
  },

  async exists(key: string): Promise<boolean> {
    return this.store.has(key);
  },
};
