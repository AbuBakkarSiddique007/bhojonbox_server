import { prisma } from "./lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@foodhub.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@foodhub.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created:", admin.email);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
