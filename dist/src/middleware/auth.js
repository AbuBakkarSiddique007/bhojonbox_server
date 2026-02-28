import "dotenv/config";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
const JWT_SECRET = process.env.JWT_SECRET;
export const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
// Check if user is logged in:
export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.token ||
            req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const decoded = verifyToken(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true, role: true, isActive: true },
        });
        if (!user || !user.isActive) {
            res.status(401).json({ message: "User not found or suspended" });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid token" });
    }
};
// Check if user has required role:
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                message: `Forbidden: Your role '${req.user?.role || "unknown"}' does not have access. Required: ${roles.join(" or ")}`,
            });
            return;
        }
        next();
    };
};
//# sourceMappingURL=auth.js.map