import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import multer from "multer";
import path from "path";
import escalationRoutes from "./src/routes/escalationRoutes.js";

import {connectDB} from "./src/config/db.js"

import authRoutes from "./src/routes/authRoutes.js"
import queryRoutes from "./src/routes/queryRoutes.js"
import tipRoutes from "./src/routes/tipRoutes.js"
import weatherRoutes from "./src/routes/weatherRoutes.js"
import priceRoutes from "./src/routes/priceRoutes.js"
import alertRoutes from "./src/routes/alertRoutes.js"
import officerRoutes from "./src/routes/officerRoutes.js"
import otpRoutes from "./src/routes/otpRoutes.js";

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Add middleware
app.use('/uploads', express.static('uploads'));

// Add route
app.use("/api/escalation", escalationRoutes);

app.use("/api/otp", otpRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/query", queryRoutes)
app.use("/api/tips", tipRoutes)
app.use("/api/weather", weatherRoutes)
app.use("/api/prices", priceRoutes)
app.use("/api/alerts", alertRoutes)
app.use("/api/officer", officerRoutes)

app.get("/", (req, res) => res.send("Hello World!"))

app.listen(process.env.PORT || 5000, () => console.log("Server running"))
