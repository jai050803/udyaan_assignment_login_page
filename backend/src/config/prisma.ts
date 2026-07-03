import { DATABASE_URL } from './env';
import { PrismaClient } from '@prisma/client';

// Inject the assembled URL into process.env so Prisma picks it up
process.env.DATABASE_URL = DATABASE_URL;

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

export default prisma;
