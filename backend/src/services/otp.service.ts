import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export function generateOtp(): string {
  const otp = Math.floor(Math.random() * 1000000);
  return otp.toString().padStart(6, '0');
}

export async function storeOtp(aadhaarHash: string, otp: string): Promise<void> {
  const otpHash = await bcrypt.hash(otp, 10);
  
  await prisma.otpSession.deleteMany({
    where: { aadhaarHash }
  });

  const expiresAt = new Date(Date.now() + parseInt(env.OTP_EXPIRY_MINUTES) * 60 * 1000);

  await prisma.otpSession.create({
    data: {
      aadhaarHash,
      otpHash,
      expiresAt
    }
  });
}

export async function verifyOtp(aadhaarHash: string, otp: string): Promise<boolean> {
  const session = await prisma.otpSession.findFirst({
    where: {
      aadhaarHash,
      verified: false,
      expiresAt: {
        gt: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!session) {
    return false;
  }

  const isValid = await bcrypt.compare(otp, session.otpHash);
  if (!isValid) {
    return false;
  }

  await prisma.otpSession.update({
    where: { id: session.id },
    data: { verified: true }
  });

  return true;
}
