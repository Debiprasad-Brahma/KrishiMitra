import express from "express";
import { createEscalation, getAllEscalations } from "../controllers/escalationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/", protect, createEscalation);
router.get("/", protect, getAllEscalations);

export default router;