import { z } from 'zod';

export const panFormSchema = z.object({
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, 'Invalid PAN format')
    .transform(v => v.toUpperCase()),
  businessName: z.string().min(3, 'Minimum 3 characters').max(100),
  ownerName: z
    .string()
    .min(3, 'Minimum 3 characters')
    .max(60)
    .regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid Pincode'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required')
});

export type PanFormData = z.infer<typeof panFormSchema>;
