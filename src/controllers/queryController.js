import Query from "../models/Query.js"
import { askAI } from "../utils/aiAPI.js";
import multer from "multer";
import path from "path";

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

export const upload = multer({ storage: storage });

// Updated Submit query to handle multiple images
export const submitQuery = async (req, res) => {
  try {
    const { question, language } = req.body;
    const userId = req.user._id;
    
    // Handle multiple image uploads
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    let queryPrompt = question;
    if (imageUrls.length > 0) {
      queryPrompt += ` [User has uploaded ${imageUrls.length} image(s) related to this query]`;
    }
    
    const answer = await askAI(queryPrompt, language);
    const query = await Query.create({
      user: userId, 
      question, 
      answer, 
      language, 
      imageUrls // Store array of image URLs
    });
    
    res.json({ success: true, answer, query });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get query history
export const getHistory = async (req, res) => {
  try {
    const queries = await Query.find({user: req.user._id}).sort({createdAt: -1})
    res.json({success: true, queries})
  } catch (err) {
    console.error(err)
    res.status(500).json({success: false, message: "Server error"})
  }
}

// Give feedback
export const giveFeedback = async (req, res) => {
  try {
    const {queryId, feedback} = req.body
    const query = await Query.findById(queryId)
    if (!query) return res.status(404).json({success: false, message: "Query not found"})
    if (query.user.toString() !== req.user._id.toString())
      return res.status(403).json({success: false, message: "Not authorized"})
    query.feedback = feedback
    await query.save()
    res.json({success: true, message: "Feedback saved", query})
  } catch (err) {
    console.error(err)
    res.status(500).json({success: false, message: "Server error"})
  }
}
