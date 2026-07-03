import { Router } from 'express';
import aadhaarRouter from './aadhaar.routes';
import otpRouter from './otp.routes';

/*
Active Routes:
GET  /api/aadhaar/test    -> sanity check
POST /api/aadhaar/validate

GET  /api/otp/test        -> sanity check
POST /api/otp/send
POST /api/otp/verify
*/

const router = Router();

router.use('/aadhaar', aadhaarRouter);
router.use('/otp', otpRouter);

// TODO: mount pan routes

export default router;
