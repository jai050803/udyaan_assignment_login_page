import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { authMiddleware } from '../middlewares/authMiddleware';
import { panValidateSchema, registrationSubmitSchema } from '../validators/pan.schema';
import { validatePan, submitRegistrationController } from '../controllers/pan.controller';

const router = Router();

router.post('/validate', authMiddleware, validate(panValidateSchema), validatePan);
router.post('/submit', authMiddleware, validate(registrationSubmitSchema), submitRegistrationController);

export default router;
