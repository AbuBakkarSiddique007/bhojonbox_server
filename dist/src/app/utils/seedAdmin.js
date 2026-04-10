import { prisma } from "../lib/prisma.js";
import { Role } from "../../../generated/prisma/enums.js";
import { envVars } from "../config/env.js";
import bcrypt from 'bcryptjs';
export async function seedAdmin() {
    try {
        const ADMIN_EMAIL = envVars.ADMIN_EMAIL;
        const ADMIN_PASSWORD = envVars.ADMIN_PASSWORD;
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment (.env).");
        }
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        const adminData = {
            name: "BhojonBox Admin",
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.ADMIN,
        };
        const existing = await prisma.user.findUnique({
            where: { email: adminData.email },
        });
        if (existing) {
            return;
        }
        await prisma.user.upsert({
            where: { email: adminData.email },
            update: {
                role: Role.ADMIN,
                name: adminData.name,
            },
            create: {
                ...adminData,
            },
        });
        // Seed categories
        await seedCategories();
    }
    catch (error) {
        console.error("Error seeding admin:", error?.message || error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
async function seedCategories() {
    const categories = [
        { name: "Bangladeshi" },
        { name: "Chinese" },
        { name: "Italian" },
        { name: "Indian" },
        { name: "Fast Food" },
        { name: "Desserts" },
        { name: "Beverages" },
        { name: "Healthy" },
    ];
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
    }
}
if (process.argv[1] && (process.argv[1].endsWith("seedAdmin.ts") || process.argv[1].endsWith("seedAdmin.js"))) {
    seedAdmin().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=seedAdmin.js.map