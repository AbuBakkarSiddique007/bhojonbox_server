import "dotenv/config";
import { Request, Response, NextFunction } from "express";
export declare const generateToken: (userId: string, role: string) => string;
export declare const verifyToken: (token: string) => {
    userId: string;
    role: string;
};
export interface AuthRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
