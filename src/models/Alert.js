import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Alert", alertSchema);
