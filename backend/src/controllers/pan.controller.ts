import { Request, Response, NextFunction } from 'express';
import { validatePanFormat, submitRegistration } from '../services/pan.service';
import { PanValidateInput, RegistrationSubmitInput } from '../validators/pan.schema';
import { ApiResponse } from '../types';

export const validatePan = async (
  req: Request<{}, {}, PanValidateInput>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { pan } = req.body;
    
    // Zod already validates it, but using the service programmatically as requested
    const isValid = validatePanFormat(pan);
    
    if (!isValid) {
      res.status(400).json({
        success: false,
        message: 'Invalid PAN format'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'PAN format valid'
    });
  } catch (error) {
    next(error);
  }
};

export const submitRegistrationController = async (
  req: Request<{}, {}, RegistrationSubmitInput>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const registration = await submitRegistration(req.body);

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: { registrationId: registration.id }
    });
  } catch (error) {
    next(error);
  }
};
