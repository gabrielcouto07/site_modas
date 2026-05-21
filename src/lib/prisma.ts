import { PrismaClient } from "@prisma/client";
import { env } from "./env";
import { createMockPrismaClient } from "./mock-db";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const prismaClient = env.useMockDatabase
  ? (createMockPrismaClient() as unknown as PrismaClient)
  : new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

export const prisma: PrismaClient = globalThis.prismaGlobal ?? prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
