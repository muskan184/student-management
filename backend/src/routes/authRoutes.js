import express from "express";
import {
  changePassword,
  deleteUser,
  followUser,
  getAllUsers,
  getFollowers,
  getFollowing,
  getProfile,
  getUserById,
  getUserSuggestions,
  loginUser,
  logoutUser,
  registerUser,
  unfollowUser,
  updateUser,
} from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, getAllUsers);
router.get("/profile", protect, getProfile);
router.post("/logout", protect, logoutUser);
router.put("/update", protect, updateUser);
router.delete("/delete", protect, deleteUser);
router.put("/change-password", protect, changePassword);
router.get("/followers", protect, getFollowers);
router.get("/following", protect, getFollowing);
router.get("/suggestions", protect, getUserSuggestions);
router.get("/:id", protect, getUserById);
router.put("/follow/:id", protect, followUser);
router.put("/unfollow/:id", protect, unfollowUser);

export default router;
