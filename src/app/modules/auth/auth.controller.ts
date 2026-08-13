import { Request, Response } from "express";
import status from 'http-status';
import { AuthRequest, generateToken } from "../../middleware/auth.js";
import { sendResponse, handleError } from "../../utils/sendResponse.js";
import { authService } from "./auth.service.js";


const setTokenCookie = (res: Response, token: string) => {
    const frontend = process.env.FRONTEND_URL || "";
    const secureFlag = process.env.NODE_ENV === "production" || frontend.startsWith("https://");

    res.cookie("token", token, {
        httpOnly: true,
        secure: secureFlag,
        sameSite: secureFlag ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};


const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, phone, address, storeName, cuisine, description } = req.body;

        if (!name || !email || !password) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
                success: false,
                message: "Name, email and password are required",
            });
        }

        const user = await authService.createUser({ name, email, password, role, phone, address, storeName, cuisine, description });

        const token = generateToken(user.id, user.role);
        setTokenCookie(res, token);

        sendResponse(res, {
            statusCode: status.CREATED,
            message: "User registered successfully",
            data: { user, token },
        });

    } catch (err: any) {
        handleError(res, err, "Server error");
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendResponse(res, {
                statusCode: status.BAD_REQUEST,
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

    } catch (err: any) {
        handleError(res, err, "Server error");
    }
};

const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await authService.findUserById(req.user!.id);

        if (!user) {
            return sendResponse(res, {
                statusCode: status.NOT_FOUND,
                success: false,
                message: "User not found",
            });
        }

        sendResponse(res, { data: { user } });

    } catch (err: any) {
        handleError(res, err, "Server error");
    }
};

const logout = async (req: Request, res: Response) => {
    const frontend = process.env.FRONTEND_URL || "";
    const secureFlag = process.env.NODE_ENV === "production" || frontend.startsWith("https://");

    res.clearCookie("token", {
        httpOnly: true,
        secure: secureFlag,
        sameSite: secureFlag ? "none" : "lax",
        path: "/",
    });
    sendResponse(res, { message: "Logged out successfully" });
};


const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, phone, address, avatar } = req.body;
        const user = await authService.updateUser(req.user!.id, { name, phone, address, avatar });

        sendResponse(res, {
            message: "Profile updated",
            data: { user },
        });

    } catch (err: any) {
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