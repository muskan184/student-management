import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addAnswer,
  deleteAnswer,
  getAnswers,
  markBestAnswer,
  updateAnswer,
} from "../controllers/answerController.js";

const router = express.Router();

router.post("/:questionId", protect, addAnswer);
router.get("/:questionId", protect, getAnswers);
router.delete("/:id", protect, deleteAnswer);
router.put("/:id", protect, updateAnswer);
router.put("/best/:id", protect, markBestAnswer);

export default router;
