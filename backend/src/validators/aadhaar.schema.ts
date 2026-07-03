import { z } from 'zod';

export const aadhaarSchema = z.object({
  aadhaar: z.string().regex(/^[1-9][0-9]{11}$/, {
    message: "Aadhaar must be exactly 12 digits and cannot start with 0",
  }),
});

export type AadhaarInput = z.infer<typeof aadhaarSchema>;
