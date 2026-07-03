import { generateOtp, verifyOtp } from '../src/services/otp.service';
import bcrypt from 'bcryptjs';

// Mock prisma
jest.mock('../src/config/prisma', () => ({
  __esModule: true,
  default: {
    otpSession: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

import prisma from '../src/config/prisma';

describe('OTP Service', () => {
  describe('generateOtp', () => {
    it('generateOtp should return exactly 6 digits', () => {
      for (let i = 0; i < 10; i++) {
        const otp = generateOtp();
        expect(otp).toMatch(/^[0-9]{6}$/);
      }
    });

    it('generateOtp should zero-pad when needed', () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.000123); // Force a specific small random
      
      const otp = generateOtp();
      
      expect(otp).toBe('000123');
      expect(otp).toHaveLength(6);
      
      Math.random = originalRandom; // restore
    });
  });

  describe('verifyOtp', () => {
    it('verifyOtp should return false for wrong otp', async () => {
      const mockHash = await bcrypt.hash('123456', 10);
      
      // Mock findFirst to return an existing session
      (prisma.otpSession.findFirst as jest.Mock).mockResolvedValue({
        id: 'session-id',
        aadhaarHash: 'dummy-hash',
        otpHash: mockHash,
        verified: false,
        expiresAt: new Date(Date.now() + 10000),
      });

      // Try to verify with a wrong OTP
      const result = await verifyOtp('dummy-hash', '654321');
      expect(result).toBe(false);
    });
  });
});
