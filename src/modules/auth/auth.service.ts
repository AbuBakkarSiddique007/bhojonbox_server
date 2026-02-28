import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { Role } from "../../../generated/prisma/enums.js";


// Create new user (for registration):
const createUser = async (data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
    phone?: string;
    address?: string;
    storeName?: string;
    cuisine?: string;
    description?: string;
}) => {

    const existing = await prisma.user.findUnique({ where: { email: data.email } });

    if (existing) {
        throw { status: 400, message: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const isProvider = data.role === Role.PROVIDER;

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: isProvider ? Role.PROVIDER : Role.CUSTOMER,
            phone: data.phone,
            address: data.address,
            ...(isProvider && {
                providerProfile: {
                    create: {
                        storeName: data.storeName || data.name,
                        cuisine: data.cuisine,
                        description: data.description,
                        address: data.address,
                        phone: data.phone,
                    },
                },
            }),
        },
        include: { providerProfile: true },
    });

    const { password: _, ...safe } = user;
    return safe;
};


// Verify user credentials for login:
const verifyUser = async (email: string, password: string) => {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw { status: 401, message: "Invalid credentials" };
    }
    if (!user.isActive) {
        throw { status: 403, message: "User is suspended" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw { status: 401, message: "Invalid credentials" };
    }

    const { password: _, ...safe } = user;

    return safe;
};


// Get user by id (no password):
const findUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true, 
            name: true, 
            email: true, 
            role: true,
            phone: true, 
            address: true, 
            avatar: true,
            isActive: true, 
            createdAt: true,
        },
    });
};


// Update profile fields:
const updateUser = async (
    id: string,
    data: { 
        name?: string; 
        phone?: string; 
        address?: string; 
        avatar?: string }
) => {
    return prisma.user.update({
        where: { id },
        data,
        select: {
            id: true, 
            name: true, 
            email: true, 
            role: true,
            phone: true, 
            address: true, 
            avatar: true,
        },
    });
};


export const authService = {
    createUser,
    verifyUser,
    findUserById,
    updateUser,
};