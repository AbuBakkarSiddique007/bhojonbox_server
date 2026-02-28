import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
export declare const authController: {
    register: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    getMe: (req: AuthRequest, res: Response) => Promise<void>;
    logout: (req: Request, res: Response) => Promise<void>;
    updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
};
