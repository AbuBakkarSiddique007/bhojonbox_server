import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { generateToken } from "../../utils/jwt.js";
import { authService } from "./auth.service.js";


const setTokenCookie = (res: Response, token: string) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};


const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, phone, address, storeName, cuisine, description } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                message: "Name, email and password are required"
            });

            return;
        }

        const user = await authService.createUser({ name, email, password, role, phone, address, storeName, cuisine, description });


        const token = generateToken(user.id, user.role);
        setTokenCookie(res, token);


        res.status(201).json({
            user,
            token
        });

    } catch (err: any) {
        if (err.status) return res.status(err.status).json({ 
            message: err.message 
        });

        console.error("Register error:", err);

        res.status(500).json({ 
            message: "Server error" 
        });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ 
                message: "Email and password are required" 
            });
            return;
        }

        const user = await authService.verifyUser(email, password);
        const token = generateToken(user.id, user.role);
        setTokenCookie(res, token);

        res.json({ user, token });

    } catch (err: any) {
        if (err.status) return res.status(err.status).json({ 
            message: err.message 
        });
        console.error("Login error:", err);
        res.status(500).json({ 
            message: "Server error" 
        });
    }
};

const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await authService.findUserById(req.user!.id);
        if (!user) { res.status(404).json({ 
            message: "User not found" 
        }); 
        return; 
    }
        res.json({ user });
    } catch (err: any) {
        res.status(500).json({ 
            message: "Server error" 
        });
    }
};

const logout = async (_req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ 
        message: "Logged out successfully" 
    });
};


const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, phone, address, avatar } = req.body;
        const user = await authService.updateUser(req.user!.id, { name, phone, address, avatar });
        res.json({ user });
    } catch (err: any) {
        res.status(500).json({ 
            message: "Server error" 
        });
    }
};

export const authController = {
    register,
    login,
    getMe,
    logout,
    updateProfile,
};