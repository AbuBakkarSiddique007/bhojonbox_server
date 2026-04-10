import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
export declare const providerController: {
    getAllProviders: (req: Request, res: Response) => Promise<void>;
    getProviderById: (req: Request, res: Response) => Promise<void>;
    getMyProfile: (req: AuthRequest, res: Response) => Promise<void>;
    updateMyProfile: (req: AuthRequest, res: Response) => Promise<void>;
};
