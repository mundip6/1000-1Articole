import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Use DATABASE_URL as primary, but fallback to POSTGRES_PRISMA_URL (Vercel's default name)
const getPrismaClient = () => {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
  return new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
