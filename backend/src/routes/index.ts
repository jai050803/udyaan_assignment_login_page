import { Router } from 'express';
import aadhaarRouter from './aadhaar.routes';
import otpRouter from './otp.routes';
import panRouter from './pan.routes';

/*
Active Routes:
GET  /api/aadhaar/test    -> sanity check
POST /api/aadhaar/validate

GET  /api/otp/test        -> sanity check
POST /api/otp/send
POST /api/otp/verify

POST /api/pan/validate
POST /api/pan/submit
*/

const router = Router();

router.use('/aadhaar', aadhaarRouter);
router.use('/otp', otpRouter);
router.use('/pan', panRouter);

export default router;
