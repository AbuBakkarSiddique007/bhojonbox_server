import express from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { providerController } from "./provider.controller";
import { Role } from "../../../../generated/prisma/enums";
const router = express.Router();
// Public routes
router.get("/", providerController.getAllProviders);
router.get("/me/profile", authenticate, authorize(Role.PROVIDER), providerController.getMyProfile);
router.put("/me/profile", authenticate, authorize(Role.PROVIDER), providerController.updateMyProfile);
router.get("/:id", providerController.getProviderById);
export const providerRouter = router;
//# sourceMappingURL=provider.route.js.map