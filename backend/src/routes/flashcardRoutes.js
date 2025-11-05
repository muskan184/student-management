import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createFlashcard, deleteFlashcard, getFlashcards, updateFlashcard } from "../controllers/flashcardController";
import { generateAIFlashcards } from "../controllers/aiControllers";


const router = express.Router();

router.post("/", protect, createFlashcard);
router.get("/", protect, getFlashcards);
router.put("/:id", protect, updateFlashcard);
router.delete("/:id", protect, deleteFlashcard);
router.post("/generate-ai", protect, generateAIFlashcards); // 🧠 AI route

export default router;
