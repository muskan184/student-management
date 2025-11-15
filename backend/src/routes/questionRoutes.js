import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createQuestion } from "../controllers/questionController.js";

const router = express.Router();

router.post("/create", protect, createQuestion);

export default router;
