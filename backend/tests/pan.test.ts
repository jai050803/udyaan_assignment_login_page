import request from 'supertest';
import { validatePanFormat } from '../src/services/pan.service';

// Mock authMiddleware before importing app
jest.mock('../src/middlewares/authMiddleware', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    if (!req.headers.authorization) {
      // The real middleware returns 401, adhering to that.
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    req.user = { aadhaarHash: 'testhash' };
    next();
  }
}));

import app from '../src/app';

describe('PAN Service', () => {
  it('should return true for valid PAN', () => {
    expect(validatePanFormat('ABCDE1234F')).toBe(true);
  });

  it('should return false for lowercase PAN', () => {
    expect(validatePanFormat('abcde1234f')).toBe(false);
  });

  it('should return false for PAN with wrong format', () => {
    expect(validatePanFormat('ABCD12345F')).toBe(false);
  });
});

describe('POST /api/pan/validate', () => {
  it('Returns 401 without auth header', async () => {
    const res = await request(app)
      .post('/api/pan/validate')
      .send({ pan: 'ABCDE1234F' });
    // Real auth middleware uses 401 for missing auth
    expect(res.status).toBe(401);
  });

  it('Returns 200 with valid PAN and valid auth token', async () => {
    const res = await request(app)
      .post('/api/pan/validate')
      .set('Authorization', 'Bearer dummy-token')
      .send({ pan: 'ABCDE1234F' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Returns 400 with invalid PAN format', async () => {
    const res = await request(app)
      .post('/api/pan/validate')
      .set('Authorization', 'Bearer dummy-token')
      .send({ pan: 'ABCDE1234' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
