import { Request, Response, NextFunction } from "express";
import { cacheGet, cacheSet } from "../services/cache.service.js";

/**
 * Redis caching middleware.
 * Caches GET responses by URL + clinicId for the specified TTL.
 */
export function cacheMiddleware(ttlSeconds: number = 60) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.method !== "GET") {
      next();
      return;
    }

    const clinicId = req.membership?.clinicId || req.user?.clinicId || "anonymous";
    const cacheKey = `cache:${clinicId}:${req.originalUrl}`;

    try {
      const cached = await cacheGet(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        res.status(200).json(parsed);
        return;
      }
    } catch {
      // Cache miss or parse error, proceed to handler
    }

    // Override res.json to intercept the response and cache it
    const originalJson = res.json.bind(res);
    res.json = ((body: unknown) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheSet(cacheKey, JSON.stringify(body), ttlSeconds).catch(() => {});
      }
      return originalJson(body);
    }) as Response["json"];

    next();
  };
}
