import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const connectionString = process.env.DATABASE_URL;
let adapter = undefined;
if (connectionString) {
    try {
        adapter = new PrismaPg({ connectionString });
    }
    catch (err) {
        console.error("Failed to create PrismaPg adapter:", err);
    }
}
else {
    console.warn("DATABASE_URL is not set — Prisma will not be able to connect to the database until you set this environment variable.");
}
// Resolve PrismaClient constructor dynamically so imports work from source and from `dist`.
async function loadPrismaClientCtor() {
    const candidates = [
        // dev (ts-node / src): generated client path used during local dev (resolve relative to this file)
        async () => {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const p = path.resolve(__dirname, "../../generated/prisma/client.js");
            return import(pathToFileURL(p).href);
        },
        // runtime after build: project-root/generated/prisma/client.js (absolute)
        async () => {
            const p = path.resolve(process.cwd(), "generated", "prisma", "client.js");
            return import(pathToFileURL(p).href);
        },
        // fallback to package @prisma/client
        async () => import("@prisma/client")
    ];
    for (const get of candidates) {
        try {
            // eslint-disable-next-line no-await-in-loop
            const mod = await get();
            if (mod && (mod.PrismaClient || mod.default || mod))
                return mod.PrismaClient ?? mod.default ?? mod;
        }
        catch (e) {
            // try next
        }
    }
    throw new Error("Could not load Prisma Client from any candidate path.");
}
const clientOptions = {};
if (adapter)
    clientOptions.adapter = adapter;
let prisma;
if (global.__bhojonbox_prisma) {
    prisma = global.__bhojonbox_prisma;
}
else {
    // top-level await is supported by target ES2023/ESNext
    const PrismaClientCtor = await loadPrismaClientCtor();
    prisma = new PrismaClientCtor(clientOptions);
    global.__bhojonbox_prisma = prisma;
}
export { prisma };
//# sourceMappingURL=prisma.js.map