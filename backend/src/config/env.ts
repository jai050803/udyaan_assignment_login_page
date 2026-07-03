import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('7002'),
  DB_HOST: z.string(),
  DB_PORT: z.string().default('5432'),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  SESSION_SECRET: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('30m'),
  OTP_EXPIRY_MINUTES: z.string().default('10'),
  OTP_RATE_LIMIT_PER_HOUR: z.string().default('3'),
  NODE_ENV: z.string().default('development'),
  POSTPIN_BASE_URL: z.string().default('https://api.postalpincode.in/pincode'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Environment variable validation failed:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

export const DATABASE_URL = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
