import express from "express";
import {
  createPlanner,
  deletePlanner,
  getPlanners,
  updatePlanner,
} from "../controllers/plannerController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", protect, createPlanner);
router.get("/", protect, getPlanners);
router.put("/:id", protect, updatePlanner);
router.delete("/:id", protect, deletePlanner);

export default router;
