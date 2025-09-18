import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: String,
  phone: {type: String, unique: true},
  role: {type: String, default: "farmer"},
  language: {
    type: String,
    enum: ["english", "malayalam", "hindi", "tamil"],
    default: "english",
  },
  isVerified: {type: Boolean, default: false}, // ✅ NEW FIELD
})

export default mongoose.model("User", userSchema)
