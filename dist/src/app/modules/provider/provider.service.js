import { prisma } from "../../lib/prisma";
const createProfile = async (userId, data) => {
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
const getProviderById = async (id) => {
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
const getProfileByUserId = async (userId) => {
    const profile = await prisma.providerProfile.findUnique({
        where: {
            userId
        },
    });
    return profile;
};
const updateProfile = async (userId, data) => {
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
//# sourceMappingURL=provider.service.js.map