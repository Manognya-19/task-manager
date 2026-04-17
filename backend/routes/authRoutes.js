const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);        // Register User
router.post("/login", loginUser);              // Login User
router.get("/profile", protect, getUserProfile); // Get User Profile
router.put("/profile", protect, updateUserProfile); // Update Profile

// Upload image endpoint
// - protected if you only want logged-in users to upload. If public upload is allowed, remove `protect`.
router.post("/upload-image",upload.single("image"),(req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Build public URL for the uploaded file
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      res.status(200).json({ imageUrl });
  }
);

module.exports = router;
