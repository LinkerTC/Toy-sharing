const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Tất cả routes trong file này đều cần authentication
router.use(auth);

// @route   GET /api/users/profile
// @desc    Lấy profile user
// @access  Private
router.get("/profile", getProfile);

// @route   PUT /api/users/profile
// @desc    Cập nhật profile user
// @access  Private
router.put("/profile", updateProfile);

module.exports = router;
