import Otp from "../models/Otp.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// helper to generate random 6-digit otp
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// send OTP
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number required" });

    const otp = generateOtp();
    await Otp.create({ phone, otp });

    // in real life you'd send via SMS, but here return it in response
    res.json({ success: true, otp, message: "OTP generated (valid 5 min)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const record = await Otp.findOne({ phone, otp });

    if (!record) return res.status(400).json({ message: "Invalid or expired OTP" });

    // find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ name: "Farmer", phone, role: "farmer", language: "english" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
