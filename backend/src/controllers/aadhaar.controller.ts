import { Request, Response, NextFunction } from 'express';
import { validateAadhaarFormat } from '../services/aadhaar.service';
import { AadhaarInput } from '../validators/aadhaar.schema';
import { ApiResponse } from '../types';

export const validateAadhaar = async (
  req: Request<{}, {}, AadhaarInput>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { aadhaar } = req.body;
    
    // The real validation is done by Zod in the middleware,
    // this calls the service for programmatic checking/testing.
    validateAadhaarFormat(aadhaar);

    res.status(200).json({
      success: true,
      message: 'Aadhaar format valid'
    });
  } catch (error) {
    next(error);
  }
};
