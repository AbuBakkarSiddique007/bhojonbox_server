import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { authController } from "./auth.controller.js";
const router = express.Router();
// Public routes:
router.post("/register", authController.register);
router.post("/login", authController.login);
const ALLOW_DEBUG = process.env.NODE_ENV !== "production" || process.env.DEBUG_COOKIES === "true";
if (ALLOW_DEBUG) {
    router.get("/debug-cookie", (req, res) => {
        const token = req.cookies?.token || null;
        res.json({ receivedCookie: !!token, token: token ? "[REDACTED]" : null, origin: req.headers.origin || null });
    });
}
// Protected routes:
router.get("/me", authenticate, authController.getMe);
router.post("/logout", authenticate, authController.logout);
router.put("/profile", authenticate, authController.updateProfile);
export const authRouter = router;
//# sourceMappingURL=auth.route.js.map