import { PrismaClient } from "@prisma/client";

declare global {
  var __orbitPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__orbitPrisma ??
  new PrismaClient({
    log: ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.__orbitPrisma = prisma;
}
