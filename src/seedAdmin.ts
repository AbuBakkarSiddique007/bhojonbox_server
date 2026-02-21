import "dotenv/config";
import { prisma } from "./lib/prisma.js";
import { Role } from "../generated/prisma/enums.js";

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;


async function seedAdmin() {
  try {
    const adminData = {
      name: "BhojonBox Admin",
      email: "admin@bhojonbox.com",
      password: "admin123",
      role: Role.ADMIN,
    };


    const existing = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existing) {
      console.log("Admin already exists, skipping....");
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

    console.log("Admin seeded successfully:", adminData.email);

  } catch (error: any) {
    console.error("Error seeding admin:", error?.message || error);
    
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
