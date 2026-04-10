import { Role } from "../../../../generated/prisma/enums";
export declare const authService: {
    createUser: (data: {
        name: string;
        email: string;
        password: string;
        role?: Role;
        phone?: string;
        address?: string;
        storeName?: string;
        cuisine?: string;
        description?: string;
    }) => Promise<{
        providerProfile: {
            userId: string;
            id: string;
            phone: string | null;
            address: string | null;
            createdAt: Date;
            updatedAt: Date;
            storeName: string;
            description: string | null;
            cuisine: string | null;
            logo: string | null;
            isOpen: boolean;
        } | null;
        role: Role;
        id: string;
        email: string;
        name: string;
        phone: string | null;
        address: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    verifyUser: (email: string, password: string) => Promise<{
        role: Role;
        id: string;
        email: string;
        name: string;
        phone: string | null;
        address: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findUserById: (id: string) => Promise<{
        role: Role;
        id: string;
        email: string;
        name: string;
        phone: string | null;
        address: string | null;
        avatar: string | null;
        isActive: boolean;
        createdAt: Date;
    } | null>;
    updateUser: (id: string, data: {
        name?: string;
        phone?: string;
        address?: string;
        avatar?: string;
    }) => Promise<{
        role: Role;
        id: string;
        email: string;
        name: string;
        phone: string | null;
        address: string | null;
        avatar: string | null;
    }>;
};
