import { NextRequest } from 'next/server';
import { RateLimitResult } from './types';
import { API_CONFIG } from './constants';

// In-memory store for rate limiting (fallback when Redis is unavailable)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Redis client (lazy initialization)
let redisClient: any = null;

/**
 * Initialize Redis client
 */
async function getRedisClient() {
  if (redisClient) return redisClient;

  if (!process.env.UPSTASH_REDIS_URL) {
    console.warn('Redis URL not configured, falling back to in-memory rate limiting');
    return null;
  }

  try {
    const { Redis } = await import('ioredis');
    redisClient = new Redis(process.env.UPSTASH_REDIS_URL);
    console.log('Redis client initialized successfully');
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis client:', error);
    return null;
  }
}

/**
 * Rate limiting with Redis support and per-plan throttling
 */
export async function rateLimit(
  request: NextRequest,
  userPlan: 'free' | 'pro' | null,
  userId?: string
): Promise<RateLimitResult> {
  const redis = await getRedisClient();

  if (redis) {
    return rateLimitRedis(request, userPlan, userId, redis);
  } else {
    return rateLimitMemory(request, userPlan);
  }
}

/**
 * Redis-based rate limiter with per-plan limits
 */
async function rateLimitRedis(
  request: NextRequest,
  userPlan: 'free' | 'pro' | null,
  userId: string | undefined,
  redis: any
): Promise<RateLimitResult> {
  const ip = getClientIP(request);
  const identifier = userId || ip;
  const key = `rate_limit:${identifier}`;

  // Get plan-specific limits
  const limits = getPlanLimits(userPlan);
  const windowMs = limits.window;
  const maxRequests = limits.requests;
  const now = Date.now();

  try {
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.expire(key, Math.ceil(windowMs / 1000));

    const results = await pipeline.exec();
    const count = results?.[0]?.[1] as number;

    if (count > maxRequests) {
      const ttl = await redis.ttl(key);
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset: now + (ttl * 1000),
        plan: userPlan || 'free',
      };
    }

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - count,
      reset: now + windowMs,
      plan: userPlan || 'free',
    };
  } catch (error) {
    console.error('Redis rate limiting error:', error);
    // Fallback to memory-based rate limiting
    return rateLimitMemory(request, userPlan);
  }
}

/**
 * Memory-based rate limiter (fallback)
 */
async function rateLimitMemory(
  request: NextRequest,
  userPlan: 'free' | 'pro' | null
): Promise<RateLimitResult> {
  const ip = getClientIP(request);
  const key = `rate_limit:${ip}`;
  const now = Date.now();

  // Get plan-specific limits
  const limits = getPlanLimits(userPlan);
  const windowMs = limits.window;
  const maxRequests = limits.requests;

  // Clean up expired entries
  cleanupExpiredEntries(now);

  const current = rateLimitStore.get(key);

  if (!current) {
    // First request from this IP
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: now + windowMs,
      plan: userPlan || 'free',
    };
  }

  if (now > current.resetTime) {
    // Window has expired, reset counter
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: now + windowMs,
      plan: userPlan || 'free',
    };
  }

  if (current.count >= maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: current.resetTime,
      plan: userPlan || 'free',
    };
  }

  // Increment counter
  current.count++;
  rateLimitStore.set(key, current);

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - current.count,
    reset: current.resetTime,
    plan: userPlan || 'free',
  };
}

/**
 * Get rate limit configuration based on user plan
 */
function getPlanLimits(userPlan?: 'free' | 'pro' | 'active' | 'trialing' | null) {
  const baseLimits = API_CONFIG.RATE_LIMIT;

  switch (userPlan) {
    case 'pro':
    case 'active':
    case 'trialing':
      return {
        requests: baseLimits.requests * 5, // 5x more requests for pro users
        window: baseLimits.window,
      };
    case 'free':
    default:
      return baseLimits;
  }
}

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to a default IP for development
  return '127.0.0.1';
}

/**
 * Clean up expired rate limit entries to prevent memory leaks
 */
function cleanupExpiredEntries(now: number): void {
  rateLimitStore.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}


