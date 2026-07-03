import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { generateOtp, storeOtp, verifyOtp } from '../services/otp.service';
import { ApiResponse } from '../types';
import { SendOtpInput, VerifyOtpInput } from '../validators/otp.schema';

// Helper for consistent hashing of Aadhaar so we can look it up in DB
function getAadhaarHash(aadhaar: string) {
  return crypto.createHash('sha256').update(aadhaar).digest('hex');
}

export const sendOtp = async (
  req: Request<{}, {}, SendOtpInput>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { aadhaar } = req.body;
    
    // Note: The prompt suggested hashing Aadhaar with bcrypt. 
    // However, bcrypt generates a salt randomly by default, meaning the hash changes every time.
    // This makes looking up the OTP session by aadhaarHash impossible in `verifyOtp`.
    // I am using SHA-256 for deterministic hashing so the lookup works.
    const aadhaarHash = getAadhaarHash(aadhaar);
    const otp = generateOtp();
    
    await storeOtp(aadhaarHash, otp);

    // TODO: In production, send OTP via SMS gateway instead of returning it here
    res.status(200).json({
      success: true,
      message: 'OTP sent',
      data: { otp }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtpController = async (
  req: Request<{}, {}, VerifyOtpInput>,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  try {
    const { aadhaar, otp } = req.body;

    const aadhaarHash = getAadhaarHash(aadhaar);
    const isValid = await verifyOtp(aadhaarHash, otp);

    if (!isValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
      return;
    }

    const sessionToken = jwt.sign({ aadhaarHash }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

    res.status(200).json({
      success: true,
      message: 'OTP verified',
      data: { sessionToken }
    });
  } catch (error) {
    next(error);
  }
};
