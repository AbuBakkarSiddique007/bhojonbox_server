import express from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import { providerController } from "./provider.controller.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = express.Router();

// Public routes
router.get("/", providerController.getAllProviders);

router.get("/me/profile", authenticate, authorize(Role.PROVIDER), providerController.getMyProfile);

router.put("/me/profile", authenticate, authorize(Role.PROVIDER), providerController.updateMyProfile);

router.get("/:id", providerController.getProviderById);

export { router as providerRouter };
