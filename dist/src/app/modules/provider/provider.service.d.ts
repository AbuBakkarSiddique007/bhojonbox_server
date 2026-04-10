export declare const providerService: {
    createProfile: (userId: string, data: {
        storeName: string;
        description?: string;
        cuisine?: string;
        logo?: string;
        address?: string;
        phone?: string;
    }) => Promise<{
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
    }>;
    getAllProviders: () => Promise<({
        user: {
            email: string;
            name: string;
        };
    } & {
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
    })[]>;
    getProviderById: (id: string) => Promise<({
        user: {
            email: string;
            name: string;
        };
    } & {
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
    }) | null>;
    getProfileByUserId: (userId: string) => Promise<{
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
    } | null>;
    updateProfile: (userId: string, data: {
        storeName?: string;
        description?: string;
        cuisine?: string;
        logo?: string;
        address?: string;
        phone?: string;
        isOpen?: boolean;
    }) => Promise<{
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
    }>;
};
