import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

let adapter: any = undefined;
if (connectionString) {
	try {
		adapter = new PrismaPg({ connectionString });
	} catch (err) {
		console.error("Failed to create PrismaPg adapter:", err);
		// adapter remains undefined — PrismaClient may still be constructed without adapter
	}
} else {
	console.warn("DATABASE_URL is not set — Prisma will not be able to connect to the database until you set this environment variable.");
}

declare global {
	// eslint-disable-next-line no-var
	var __bhojonbox_prisma: PrismaClient | undefined;
}

const clientOptions: any = {};
if (adapter) clientOptions.adapter = adapter;

const prisma: PrismaClient = (global as any).__bhojonbox_prisma ?? new PrismaClient(clientOptions);
if (!(global as any).__bhojonbox_prisma) (global as any).__bhojonbox_prisma = prisma;

export { prisma };