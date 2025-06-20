import rateLimit from "express-rate-limit";
import { logger } from "../utils/logger";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // for Each IP in 15 minutes 100 requests
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`
  legacyHeaders: false, // `X-RateLimit-*`
});

// Custom rate limiter for crypto API requests
export const cryptoApiLimiter = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 50, // max 50 requests per minute
  currentRequests: 0,
  resetTime: Date.now() + 60 * 1000,

  canRequest: () => {
    if (Date.now() > cryptoApiLimiter.resetTime) {
      cryptoApiLimiter.currentRequests = 0;
      cryptoApiLimiter.resetTime = Date.now() + cryptoApiLimiter.windowMs;
    }
    return cryptoApiLimiter.currentRequests < cryptoApiLimiter.maxRequests;
  },

  addRequest: () => {
    cryptoApiLimiter.currentRequests++;
  },
};
