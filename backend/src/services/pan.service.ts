import prisma from '../config/prisma';
import crypto from 'crypto';
import { RegistrationSubmitInput } from '../validators/pan.schema';

// Helper for consistent hashing of Aadhaar so we can upsert by it
function getAadhaarHash(aadhaar: string) {
  return crypto.createHash('sha256').update(aadhaar).digest('hex');
}

export function validatePanFormat(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
}

export async function submitRegistration(data: RegistrationSubmitInput) {
  // Using SHA-256 instead of bcrypt so upsert matching works correctly
  const aadhaarHash = getAadhaarHash(data.aadhaar);
  const pan = data.pan.toUpperCase();

  const registration = await prisma.registration.upsert({
    where: { aadhaarHash },
    update: {
      pan,
      businessName: data.businessName,
      ownerName: data.ownerName,
      pincode: data.pincode,
      city: data.city,
      state: data.state
    },
    create: {
      aadhaarHash,
      pan,
      businessName: data.businessName,
      ownerName: data.ownerName,
      pincode: data.pincode,
      city: data.city,
      state: data.state
    }
  });

  return registration;
}
