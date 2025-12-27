import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/create", protect, createQuestion);
router.get("/", protect, getAllQuestions); // 👈 ADD
router.get("/:id", protect, getQuestionById); // 👈 ADD
router.delete("/:id", protect, deleteQuestion);
router.put("/:id", protect, updateQuestion);

export default router;
