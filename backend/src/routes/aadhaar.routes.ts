import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { aadhaarSchema } from '../validators/aadhaar.schema';
import { validateAadhaar } from '../controllers/aadhaar.controller';

const router = Router();

router.post('/validate', validate(aadhaarSchema), validateAadhaar);

export default router;
