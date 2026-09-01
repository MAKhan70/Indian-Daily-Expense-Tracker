import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");

const globalForPrisma = globalThis as unknown as { pocketLedgerPrisma?: PrismaClient };
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

export const prisma = globalForPrisma.pocketLedgerPrisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.pocketLedgerPrisma = prisma;
