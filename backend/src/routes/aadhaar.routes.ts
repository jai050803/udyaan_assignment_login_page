import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { aadhaarSchema } from '../validators/aadhaar.schema';
import { validateAadhaar } from '../controllers/aadhaar.controller';

const router = Router();

router.get('/test', (req, res) => {
  res.status(200).json({ success: true, message: "Aadhaar routes are working" });
});

router.post('/validate', validate(aadhaarSchema), validateAadhaar);

export default router;
