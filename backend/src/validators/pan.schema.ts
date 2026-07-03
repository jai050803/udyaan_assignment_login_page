import { z } from 'zod';

export const panValidateSchema = z.object({
  pan: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, "Invalid PAN format")
    .transform((val) => val.toUpperCase()),
});

export const registrationSubmitSchema = z.object({
  aadhaar: z.string().regex(/^[1-9][0-9]{11}$/, "Must be exactly 12 digits and cannot start with 0"),
  pan: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, "Invalid PAN format")
    .transform((val) => val.toUpperCase()),
  businessName: z.string().min(3).max(100).trim(),
  ownerName: z.string()
    .min(3)
    .max(60)
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid Pincode"),
  city: z.string().min(2).max(60),
  state: z.string().min(2).max(60),
});

export type PanValidateInput = z.infer<typeof panValidateSchema>;
export type RegistrationSubmitInput = z.infer<typeof registrationSubmitSchema>;
