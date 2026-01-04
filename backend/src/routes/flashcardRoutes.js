import express from "express";

import {
  createFlashcard,
  deleteFlashcard,
  getFlashcardById,
  getFlashcards,
  updateFlashcard,
} from "../controllers/flashcardController.js";
import { generateAIFlashcards } from "../controllers/aiControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createFlashcard);
router.get("/", protect, getFlashcards);
router.get("/:id", protect, getFlashcardById);
router.put("/:id", protect, updateFlashcard);
router.delete("/:id", protect, deleteFlashcard);
router.post("/generate-ai", protect, generateAIFlashcards); // 🧠 AI route

export default router;
