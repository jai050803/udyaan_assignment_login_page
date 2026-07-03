import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { sendOtpSchema, verifyOtpSchema } from '../validators/otp.schema';
import { sendOtp, verifyOtpController } from '../controllers/otp.controller';
import { otpRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.get('/test', (req, res) => {
  res.status(200).json({ success: true, message: 'OTP routes are working' });
});

router.post('/send', otpRateLimiter, validate(sendOtpSchema), sendOtp);
router.post('/verify', validate(verifyOtpSchema), verifyOtpController);

export default router;
