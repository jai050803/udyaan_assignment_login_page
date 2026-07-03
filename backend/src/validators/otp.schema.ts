import { z } from 'zod';

export const sendOtpSchema = z.object({
  aadhaar: z.string().regex(/^[1-9][0-9]{11}$/, "Must be exactly 12 digits and cannot start with 0"),
});

export const verifyOtpSchema = z.object({
  aadhaar: z.string().regex(/^[1-9][0-9]{11}$/, "Must be exactly 12 digits and cannot start with 0"),
  otp: z.string().regex(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
