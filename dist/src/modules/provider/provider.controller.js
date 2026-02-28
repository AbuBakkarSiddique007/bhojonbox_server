import { sendResponse, handleError } from "../../utils/sendResponse.js";
import { providerService } from "./provider.service.js";
const getAllProviders = async (req, res) => {
    try {
        const providers = await providerService.getAllProviders();
        sendResponse(res, { data: { providers } });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch providers");
    }
};
const getProviderById = async (req, res) => {
    try {
        const provider = await providerService.getProviderById(req.params.id);
        if (!provider) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Provider not found",
            });
        }
        sendResponse(res, { data: { provider } });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch provider by ID");
    }
};
const getMyProfile = async (req, res) => {
    try {
        const profile = await providerService.getProfileByUserId(req.user.id);
        if (!profile) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Provider profile not found",
            });
        }
        sendResponse(res, { data: { profile } });
    }
    catch (err) {
        handleError(res, err, "Failed to fetch provider profile");
    }
};
const updateMyProfile = async (req, res) => {
    try {
        const { storeName, description, cuisine, logo, address, phone, isOpen } = req.body;
        const profile = await providerService.updateProfile(req.user.id, {
            storeName, description, cuisine, logo, address, phone, isOpen,
        });
        sendResponse(res, {
            message: "Profile updated",
            data: { profile },
        });
    }
    catch (err) {
        handleError(res, err, "Failed to update provider profile");
    }
};
export const providerController = {
    getAllProviders,
    getProviderById,
    getMyProfile,
    updateMyProfile,
};
//# sourceMappingURL=provider.controller.js.map