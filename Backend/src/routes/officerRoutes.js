import express from "express";
import { getAllQueries, getFarmers } from "../controllers/officerController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/queries", protect, getAllQueries);
router.get("/farmers", protect, getFarmers);

export default router;
