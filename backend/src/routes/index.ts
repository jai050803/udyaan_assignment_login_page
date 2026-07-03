import { Router } from 'express';
import aadhaarRouter from './aadhaar.routes';

const router = Router();

router.use('/aadhaar', aadhaarRouter);

// TODO: mount otp routes
// TODO: mount pan routes

export default router;
