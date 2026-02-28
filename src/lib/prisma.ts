import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

let adapter: any = undefined;
if (connectionString) {
	try {
		adapter = new PrismaPg({ connectionString });
	} catch (err) {
		console.error("Failed to create PrismaPg adapter:", err);
	}
} else {
	console.warn("DATABASE_URL is not set — Prisma will not be able to connect to the database until you set this environment variable.");
}

// Resolve PrismaClient constructor dynamically so imports work from source and from `dist`.
async function loadPrismaClientCtor(): Promise<any> {
	const candidates = [
		// dev (ts-node / src): generated client path used during local dev
		() => import("../../generated/prisma/client"),
		// runtime after build: project-root/generated/prisma/client.js
		() => import(process.cwd() + "/generated/prisma/client"),
		// fallback to package @prisma/client
		() => import("@prisma/client")
	];

	for (const get of candidates) {
		try {
			// eslint-disable-next-line no-await-in-loop
			const mod = await get();
			if (mod && (mod.PrismaClient || mod.default || mod)) return mod.PrismaClient ?? mod.default ?? mod;
		} catch (e) {
			// try next
		}
	}
	throw new Error("Could not load Prisma Client from any candidate path.");
}

declare global {
	// eslint-disable-next-line no-var
	var __bhojonbox_prisma: any | undefined;
}

const clientOptions: any = {};
if (adapter) clientOptions.adapter = adapter;

let prisma: any;
if ((global as any).__bhojonbox_prisma) {
	prisma = (global as any).__bhojonbox_prisma;
} else {
	// top-level await is supported by target ES2023/ESNext
	const PrismaClientCtor = await loadPrismaClientCtor();
	prisma = new PrismaClientCtor(clientOptions);
	(global as any).__bhojonbox_prisma = prisma;
}

export { prisma };