import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const signupLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "30m"),
});

export const profileLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "30s"),
});

export const userMessagesLimiter = new Ratelimit({
  redis,
  limiter:Ratelimit.slidingWindow(100,'1m')
})

export const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1m"),
  analytics: true,
});
