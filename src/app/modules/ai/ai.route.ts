import { Router } from "express";
import { aiController } from "./ai.controller.js";

const router = Router();

router.get("/suggestions", aiController.getSuggestions);
router.post("/chat", aiController.chat);

export const aiRouter = router;
