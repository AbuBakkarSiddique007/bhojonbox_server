import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { providerService } from "./provider.service.js";


const getAllProviders = async (_req: Request, res: Response) => {
    try {
        const providers = await providerService.getAllProviders();
        res.json({ providers });
    } catch (error: any) {
        res.status(500).json({ 
            message: "Failed to fetch providers",
            error: error.message 
        });
    }
};


const getProviderById = async (req: Request, res: Response) => {
    try {
        const provider = await providerService.getProviderById(req.params.id as string);
        if (!provider) {
            res.status(404).json({ message: "Provider not found" });
            return;
        }
        res.json({ provider });
    } catch (error: any) {
        res.status(500).json({ 
            message: "Failed to fetch provider by ID",
            error: error.message 
        });
    }
};


const getMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        const profile = await providerService.getProfileByUserId(req.user!.id);
        if (!profile) {
            res.status(404).json({ message: "Provider profile not found" });
            return;
        }
        res.json({ profile });
    } catch (error: any) {
        res.status(500).json({ 
            message: "Failed to fetch provider profile",
            error: error.message 
        });
    }
};


const updateMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { storeName, description, cuisine, logo, address, phone, isOpen } = req.body;
        const profile = await providerService.updateProfile(req.user!.id, {
            storeName, description, cuisine, logo, address, phone, isOpen,
        });
        res.json({ profile });
    } catch (error: any) {
        res.status(500).json({ 
            message: "Failed to update provider profile",
            error: error.message 
        });
    }
};

export const providerController = {
    getAllProviders,
    getProviderById,
    getMyProfile,
    updateMyProfile,
};