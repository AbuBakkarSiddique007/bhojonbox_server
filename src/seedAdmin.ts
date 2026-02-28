import "dotenv/config";
import { prisma } from "./lib/prisma.js";
import { Role } from "../generated/prisma/enums.js";

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;


async function seedAdmin() {
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment (.env). Aborting seeding.");
      process.exit(1);
    }

    const adminData = {
      name: "BhojonBox Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: Role.ADMIN,
    };


    const existing = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existing) {
      return;
    }


    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminData),
    });


    if (!response.ok) {
      const errData: any = await response.json();
      throw new Error(errData.message || "Failed to seed admin user");
    }


    await prisma.user.update({
      where: { 
        email: adminData.email 
      },
      data: { 
        role: Role.ADMIN 
      },
    });


    // Seed categories
    await seedCategories();

  } catch (error: any) {
    console.error("Error seeding admin:", error?.message || error);

  } finally {
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

seedAdmin();
