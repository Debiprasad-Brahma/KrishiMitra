import express from "express";
import { getTips } from "../controllers/tipController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getTips);

export default router;
