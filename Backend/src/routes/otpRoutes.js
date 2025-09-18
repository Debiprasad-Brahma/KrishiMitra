import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";

const router = express.Router();

router.post("/send", sendOtp);       // request OTP
router.post("/verify", verifyOtp);   // verify OTP

export default router;
