import request from 'supertest';
import app from '../src/app';
import { validateAadhaarFormat } from '../src/services/aadhaar.service';

describe('Aadhaar Service', () => {
  it('should return true for valid 12-digit aadhaar starting with non-zero digit', () => {
    expect(validateAadhaarFormat('912345678901')).toBe(true);
  });

  it('should return false for aadhaar starting with 0', () => {
    expect(validateAadhaarFormat('012345678901')).toBe(false);
  });

  it('should return false for aadhaar with 11 digits', () => {
    expect(validateAadhaarFormat('12345678901')).toBe(false);
  });

  it('should return false for aadhaar with letters', () => {
    expect(validateAadhaarFormat('9123456789AB')).toBe(false);
  });
});

describe('POST /api/aadhaar/validate', () => {
  it('Returns 200 for valid aadhaar', async () => {
    const res = await request(app)
      .post('/api/aadhaar/validate')
      .send({ aadhaar: '912345678901' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Returns 400 for invalid aadhaar with errors array containing field "aadhaar"', async () => {
    const res = await request(app)
      .post('/api/aadhaar/validate')
      .send({ aadhaar: '12345' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'aadhaar' }),
      ])
    );
  });

  it('Returns 400 for empty body', async () => {
    const res = await request(app)
      .post('/api/aadhaar/validate')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'aadhaar' }),
      ])
    );
  });
});
