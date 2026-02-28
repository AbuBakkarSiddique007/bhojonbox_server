import { generateToken } from "../../middleware/auth.js";
import { sendResponse, handleError } from "../../utils/sendResponse.js";
import { authService } from "./auth.service.js";
const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, address, storeName, cuisine, description } = req.body;
        if (!name || !email || !password) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Name, email and password are required",
            });
        }
        const user = await authService.createUser({ name, email, password, role, phone, address, storeName, cuisine, description });
        const token = generateToken(user.id, user.role);
        setTokenCookie(res, token);
        sendResponse(res, {
            statusCode: 201,
            message: "User registered successfully",
            data: { user, token },
        });
    }
    catch (err) {
        handleError(res, err, "Server error");
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Email and password are required",
            });
        }
        const user = await authService.verifyUser(email, password);
        const token = generateToken(user.id, user.role);
        setTokenCookie(res, token);
        sendResponse(res, {
            message: "Logged in successfully",
            data: { user, token },
        });
    }
    catch (err) {
        handleError(res, err, "Server error");
    }
};
const getMe = async (req, res) => {
    try {
        const user = await authService.findUserById(req.user.id);
        if (!user) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User not found",
            });
        }
        sendResponse(res, { data: { user } });
    }
    catch (err) {
        handleError(res, err, "Server error");
    }
};
const logout = async (req, res) => {
    res.clearCookie("token");
    sendResponse(res, { message: "Logged out successfully" });
};
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, avatar } = req.body;
        const user = await authService.updateUser(req.user.id, { name, phone, address, avatar });
        sendResponse(res, {
            message: "Profile updated",
            data: { user },
        });
    }
    catch (err) {
        handleError(res, err, "Server error");
    }
};
export const authController = {
    register,
    login,
    getMe,
    logout,
    updateProfile,
};
//# sourceMappingURL=auth.controller.js.map