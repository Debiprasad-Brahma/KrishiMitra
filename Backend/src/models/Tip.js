import mongoose from "mongoose";

const tipSchema = new mongoose.Schema({
  question: String,
  tip: String,
  language: String,
});

export default mongoose.model("Tip", tipSchema);
