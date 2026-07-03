import { Router } from 'express';
import { getPinDetails } from '../controllers/pin.controller';

const router = Router();

router.get('/:pincode', getPinDetails);

export default router;
