import express from "express";
import multer from "multer";
import { generateAIResponse } from "../controllers/aiResponse.js";
import { protect } from "../middleware/authMiddleware.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();
router.post("/generate", protect, upload.single("file"), generateAIResponse);

export default router;
