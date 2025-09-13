import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  question: String,
  answer: String,
  language: String,
  imageUrls: [String], // Changed from imageUrl to imageUrls array
  feedback: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Query", querySchema);