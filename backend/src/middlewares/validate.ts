import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ApiResponse, FieldError } from '../types';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const parsed = schema.safeParse(req.body);
      
      if (!parsed.success) {
        const errors: FieldError[] = parsed.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }
      
      req.body = parsed.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};
