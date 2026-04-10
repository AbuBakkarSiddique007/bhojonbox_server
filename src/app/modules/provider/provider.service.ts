import { prisma } from "../../lib/prisma.js";


const createProfile = async (userId: string, data: {
    storeName: string;
    description?: string;
    cuisine?: string;
    logo?: string;
    address?: string;
    phone?: string;
}) => {
    const profile = await prisma.providerProfile.create({
        data: {
            userId,
            storeName: data.storeName,
            description: data.description,
            cuisine: data.cuisine,
            logo: data.logo,
            address: data.address,
            phone: data.phone,
        },
    });
    return profile;
};


const getAllProviders = async () => {
    const providers = await prisma.providerProfile.findMany({
        where: { user: { isActive: true } },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return providers;
};



const getProviderById = async (id: string) => {
    const provider = await prisma.providerProfile.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            },
        },
    });
    return provider;
};


const getProfileByUserId = async (userId: string) => {
    const profile = await prisma.providerProfile.findUnique({
        where: {
            userId
        },
    });

    return profile;
};


const updateProfile = async (userId: string, data: {
    storeName?: string;
    description?: string;
    cuisine?: string;
    logo?: string;
    address?: string;
    phone?: string;
    isOpen?: boolean;
}) => {
    const profile = await prisma.providerProfile.update({
        where: {
            userId
        },
        data,
    });
    return profile;
};

export const providerService = {
    createProfile,
    getAllProviders,
    getProviderById,
    getProfileByUserId,
    updateProfile,
};
