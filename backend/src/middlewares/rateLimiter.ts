import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const otpRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(env.OTP_RATE_LIMIT_PER_HOUR),
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many OTP requests. Try again after 1 hour.'
    });
  },
});
