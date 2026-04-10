import { Request, Response } from "express";
import status from 'http-status';
import { AuthRequest } from "../../middleware/auth";
import { sendResponse, handleError } from "../../utils/sendResponse";  
import { providerService } from "./provider.service.js";


const getAllProviders = async (req: Request, res: Response) => {
    try {
        const providers = await providerService.getAllProviders();

        sendResponse(res, { data: { providers } });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch providers");
    }
};


const getProviderById = async (req: Request, res: Response) => {
    try {
        const provider = await providerService.getProviderById(req.params.id as string);

        if (!provider) {
            return sendResponse(res, {
                statusCode: status.NOT_FOUND,
                success: false,
                message: "Provider not found",
            });
        }

        sendResponse(res, { data: { provider } });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch provider by ID");
    }
};


const getMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        const profile = await providerService.getProfileByUserId(req.user!.id);

        if (!profile) {
            return sendResponse(res, {
                statusCode: status.NOT_FOUND,
                success: false,
                message: "Provider profile not found",
            });
        }

        sendResponse(res, { data: { profile } });
    } catch (err: any) {
        handleError(res, err, "Failed to fetch provider profile");
    }
};


const updateMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { storeName, description, cuisine, logo, address, phone, isOpen } = req.body;
        const profile = await providerService.updateProfile(req.user!.id, {
            storeName, description, cuisine, logo, address, phone, isOpen,
        });

        sendResponse(res, {
            message: "Profile updated",
            data: { profile },
        });
    } catch (err: any) {
        handleError(res, err, "Failed to update provider profile");
    }
};

export const providerController = {
    getAllProviders,
    getProviderById,
    getMyProfile,
    updateMyProfile,
};