import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../../../generated/prisma/client";
import { envVars } from "../config/env";
const connectionString = envVars.DATABASE_URL;
const adapter = connectionString ? new PrismaPg({ connectionString }) : undefined;
const prisma = new PrismaClient(adapter ? { adapter } : {});
export { prisma };
//# sourceMappingURL=prisma.js.map