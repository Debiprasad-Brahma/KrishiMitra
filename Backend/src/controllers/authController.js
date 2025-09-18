import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ---------------------- SIGNUP ----------------------
export const signup = async (req, res) => {
  try {
    const { name, phone, role, language } = req.body;

    let user = await User.findOne({ phone });
    if (user) return res.status(400).json({ message: "Phone already registered" });

    // create user but mark as not verified
    user = await User.create({ name, phone, role, language, isVerified: false });

    // generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ phone, otp });

    res.json({
      success: true,
      message: "Signup successful. OTP sent to phone. Please verify.",
      otp // ⚠️ in real app send via SMS, returning here only for testing
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- VERIFY OTP ----------------------
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const record = await Otp.findOne({ phone, otp });
    if (!record) return res.status(400).json({ message: "Invalid or expired OTP" });

    // update user verified status
    const user = await User.findOneAndUpdate(
      { phone },
      { isVerified: true },
      { new: true }
    );

    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- LOGIN ----------------------
export const login = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify OTP before login" });

    res.json({ token: generateToken(user._id), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- GET PROFILE ----------------------
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- UPDATE PROFILE ----------------------
export const updateProfile = async (req, res) => {
  try {
    const { name, language } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, language },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};