import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export const prisma = hasDatabaseUrl ? global.prisma ?? new PrismaClient() : null;

if (prisma && process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
