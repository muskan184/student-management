import express from "express";
import {
  saveChatMessage,
  createNewChat,
  getAllChats,
  getChatById,
  deleteChat,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/new", protect, createNewChat);
router.post("/", protect, saveChatMessage);
router.get("/all", protect, getAllChats);
router.get("/:chatId", protect, getChatById);
router.delete("/:chatId", protect, deleteChat);

export default router;
