import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({
  url: `${process.env.DATABASE_URL}`,
  // authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});
const adapter = new PrismaLibSQL(libsql);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter, log: ["error", "warn"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
