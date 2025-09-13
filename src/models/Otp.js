import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } 
  // expires: 300 → OTP auto-deletes after 5 minutes
});

export default mongoose.model("Otp", otpSchema);
