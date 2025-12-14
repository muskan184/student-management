import express from "express";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  togglePin,
  toggleStar,
  updateNote,
} from "../controllers/notesControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.post("/", upload.single("file"), protect, createNote);
router.get("/", protect, getNotes);
router.put("/:id", upload.single("file"), protect, updateNote);
router.delete("/:id", protect, deleteNote);
router.get("/:id", protect, getNoteById);
router.patch("/:id/star", protect, toggleStar);
router.patch("/:id/pin", protect, togglePin);

export default router;
