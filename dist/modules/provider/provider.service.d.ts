export declare const providerService: {
    createProfile: (userId: string, data: {
        storeName: string;
        description?: string;
        cuisine?: string;
        logo?: string;
        address?: string;
        phone?: string;
    }) => Promise<any>;
    getAllProviders: () => Promise<any>;
    getProviderById: (id: string) => Promise<any>;
    getProfileByUserId: (userId: string) => Promise<any>;
    updateProfile: (userId: string, data: {
        storeName?: string;
        description?: string;
        cuisine?: string;
        logo?: string;
        address?: string;
        phone?: string;
        isOpen?: boolean;
    }) => Promise<any>;
};
