import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  console.error('Error:', err);

  const message = env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Internal server error';

  res.status(500).json({
    success: false,
    message
  });
};
