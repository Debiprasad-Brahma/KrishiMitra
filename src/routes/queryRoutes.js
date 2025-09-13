import express from "express";
import { submitQuery, getHistory, giveFeedback, upload } from "../controllers/queryController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/", protect, upload.array('images', 5), submitQuery); // Allow up to 5 images
router.get("/history", protect, getHistory);
router.post("/feedback", protect, giveFeedback);

export default router;