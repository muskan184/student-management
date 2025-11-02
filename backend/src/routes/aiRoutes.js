import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateAIFlashcards } from "../controllers/aiControllers.js";

const router = express.Router();

// POST /api/ai/generate-flashcards
router.post("/generate-flashcards", protect, generateAIFlashcards);

export default router;
