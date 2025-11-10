// server/src/prisma.ts

import { PrismaClient } from "@prisma/client";

// Create a single instance to use across your app
export const prisma = new PrismaClient({
  log: ["query", "error", "warn"], // logs SQL queries in development
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});