import Query from "../models/Query.js";
import { askAI, analyzeImage, validateImageFiles, cleanupFiles } from "../utils/aiAPI.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `query-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  }
});

// Enhanced Submit query to handle multiple images with AI analysis
export const submitQuery = async (req, res) => {
  let uploadedFilePaths = [];
  
  try {
    const { question, language } = req.body;
    const userId = req.user._id;
    const files = req.files;
    
    // Validate files if provided
    if (files && files.length > 0) {
      validateImageFiles(files);
      uploadedFilePaths = files.map(file => file.path);
    }
    
    let finalPrompt = question || "";
    let answer = "";
    
    if (files && files.length > 0) {
      // If images are provided, analyze them with AI
      if (finalPrompt.trim()) {
        // User provided both text and images
        answer = await askAI(finalPrompt, language, uploadedFilePaths);
      } else {
        // Only images provided, use image analysis
        answer = await analyzeImage(uploadedFilePaths, "", language);
      }
    } else if (finalPrompt.trim()) {
      // Only text query
      answer = await askAI(finalPrompt, language);
    } else {
      throw new Error("Please provide either a text query or upload images.");
    }
    
    // Store relative paths for database
    const imageUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];
    
    const query = await Query.create({
      user: userId, 
      question: finalPrompt, 
      answer, 
      language, 
      imageUrls
    });
    
    res.json({ success: true, answer, query });
  } catch (err) {
    console.error('Query submission error:', err);
    
    // Clean up uploaded files on error
    if (uploadedFilePaths.length > 0) {
      cleanupFiles(uploadedFilePaths);
    }
    
    res.status(500).json({ 
      success: false, 
      message: err.message || "Server error" 
    });
  }
};

// Specific endpoint for image analysis
export const analyzeImageEndpoint = async (req, res) => {
  let uploadedFilePaths = [];
  
  try {
    const { question, language } = req.body;
    const userId = req.user._id;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image for analysis."
      });
    }
    
    validateImageFiles(files);
    uploadedFilePaths = files.map(file => file.path);
    
    const finalQuestion = question || "Please analyze these farming images and provide detailed advice.";
    const answer = await analyzeImage(uploadedFilePaths, finalQuestion, language);
    
    const imageUrls = files.map(file => `/uploads/${file.filename}`);
    
    const query = await Query.create({
      user: userId,
      question: finalQuestion,
      answer,
      language,
      imageUrls
    });
    
    res.json({ success: true, answer, query });
  } catch (err) {
    console.error('Image analysis error:', err);
    
    if (uploadedFilePaths.length > 0) {
      cleanupFiles(uploadedFilePaths);
    }
    
    res.status(500).json({
      success: false,
      message: err.message || "Image analysis failed"
    });
  }
};

// Get query history with enhanced image support
export const getHistory = async (req, res) => {
  try {
    const queries = await Query.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 queries for performance
    
    res.json({ success: true, queries });
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Give feedback with enhanced validation
export const giveFeedback = async (req, res) => {
  try {
    const { queryId, feedback } = req.body;
    
    if (!queryId || !feedback) {
      return res.status(400).json({
        success: false,
        message: "Query ID and feedback are required"
      });
    }
    
    if (!['positive', 'negative'].includes(feedback)) {
      return res.status(400).json({
        success: false,
        message: "Feedback must be either 'positive' or 'negative'"
      });
    }
    
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found"
      });
    }
    
    if (query.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to provide feedback on this query"
      });
    }
    
    query.feedback = feedback;
    await query.save();
    
    res.json({ success: true, message: "Feedback saved", query });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get query statistics
export const getQueryStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Query.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalQueries: { $sum: 1 },
          positiveFeeback: {
            $sum: { $cond: [{ $eq: ["$feedback", "positive"] }, 1, 0] }
          },
          negativeFeeback: {
            $sum: { $cond: [{ $eq: ["$feedback", "negative"] }, 1, 0] }
          },
          queriesWithImages: {
            $sum: { 
              $cond: [
                { $gt: [{ $size: { $ifNull: ["$imageUrls", []] } }, 0] }, 
                1, 
                0
              ] 
            }
          },
          languageBreakdown: {
            $push: "$language"
          }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalQueries: 0,
      positiveFeeback: 0,
      negativeFeeback: 0,
      queriesWithImages: 0,
      languageBreakdown: []
    };
    
    res.json({ success: true, stats: result });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete query (with image cleanup)
export const deleteQuery = async (req, res) => {
  try {
    const { queryId } = req.params;
    const query = await Query.findById(queryId);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found"
      });
    }
    
    if (query.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this query"
      });
    }
    
    // Clean up associated image files
    if (query.imageUrls && query.imageUrls.length > 0) {
      const filePaths = query.imageUrls.map(url => 
        path.join(process.cwd(), 'uploads', path.basename(url))
      );
      cleanupFiles(filePaths);
    }
    
    await Query.findByIdAndDelete(queryId);
    
    res.json({ success: true, message: "Query deleted successfully" });
  } catch (err) {
    console.error('Delete query error:', err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};