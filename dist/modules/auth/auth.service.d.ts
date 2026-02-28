import { Role } from "../../../generated/prisma/enums.js";
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
    }) => Promise<any>;
    verifyUser: (email: string, password: string) => Promise<any>;
    findUserById: (id: string) => Promise<any>;
    updateUser: (id: string, data: {
        name?: string;
        phone?: string;
        address?: string;
        avatar?: string;
    }) => Promise<any>;
};
