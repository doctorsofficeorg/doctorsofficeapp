import Redis from "ioredis";
import { config } from "../config/index.js";

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  return redis;
}

export function initRedis(): Promise<Redis | null> {
  if (!config.redisUrl) {
    console.log("[Redis] No REDIS_URL configured, running without cache");
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const client = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times: number) {
        if (times > 3) {
          console.warn("[Redis] Max retries reached, giving up");
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    client
      .connect()
      .then(() => {
        console.log("[Redis] Connected successfully");
        redis = client;
        resolve(client);
      })
      .catch((err) => {
        console.warn("[Redis] Connection failed, running without cache:", err.message);
        redis = null;
        resolve(null);
      });

    client.on("error", (err) => {
      console.warn("[Redis] Error:", err.message);
    });
  });
}

export async function cacheGet(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  if (!redis) return;
  try {
    if (ttlSeconds) {
      await redis.set(key, value, "EX", ttlSeconds);
    } else {
      await redis.set(key, value);
    }
  } catch {
    // Silently fail - cache is non-critical
  }
}

export async function cacheDel(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch {
    // Silently fail
  }
}
