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
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
const router = express.Router();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, '../uploads')

  // Ensure upload directory exists
  ; (async () => {
    try {
      await fs.promises.mkdir(uploadDir, { recursive: true })
    } catch (err) {
      console.error('❌ Failed to create upload directory:', err)
    }
  })()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage });

router.put(
  "/update",
  protect,
  (req, res, next) => {
    console.log("🔥 Before multer")
    next()
  },
  upload.single("profilePic"),
  (req, res, next) => {
    console.log("🔥 After multer")
    console.log("FILE:", req.file)
    console.log("BODY:", req.body)
    next()
  },
  updateUser
)


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, getAllUsers);
router.get("/profile", protect, getProfile);
router.post("/logout", protect, logoutUser);
router.put("/update", protect, upload.single("profilePic"), updateUser);
router.delete("/delete", protect, deleteUser);
router.put("/change-password", protect, changePassword);
router.get("/followers", protect, getFollowers);
router.get("/following", protect, getFollowing);
router.get("/suggestions", protect, getUserSuggestions);
router.get("/:id", protect, getUserById);
router.put("/follow/:id", protect, followUser);
router.put("/unfollow/:id", protect, unfollowUser);

export default router;
