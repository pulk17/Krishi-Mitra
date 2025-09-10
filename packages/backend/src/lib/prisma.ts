import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

// This function creates a new PrismaClient instance.
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

// Define a type for the global object that will hold our Prisma instance.
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Augment the global object to include our prisma instance.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Check if a prisma instance already exists on the global object.
// If not, create one. This ensures only one instance exists, even with hot-reloading.
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Use a default export for the singleton instance.
export default prisma;

// In development, we assign the prisma instance back to the global object.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}