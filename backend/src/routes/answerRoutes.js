import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addAnswer, getAnswers } from "../controllers/answerController.js";

const router = express.Router();

router.post("/add/:questionId", protect, addAnswer);
router.get("/:questionId", protect, getAnswers);

export default router;
