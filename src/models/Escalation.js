import mongoose from "mongoose";

const escalationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  crop: { type: String, required: true },
  concern: { type: String, required: true },
  issueDescription: { type: String, required: true },
  language: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  officerNotes: { type: String }
});

export default mongoose.model("Escalation", escalationSchema);