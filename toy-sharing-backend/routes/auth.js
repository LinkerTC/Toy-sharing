const express = require("express");
const { register, login, getMe, verifyUser, resendVerificationEmail } = require("../controllers/authController");
const {
  validateRegistration,
  validateLogin,
} = require("../middleware/validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Đăng ký user mới
// @access  Public
router.post("/register", validateRegistration, register);

// @route   POST /api/auth/verify
// @desc    Verify user email
// @access  Public
router.post("/verify", verifyUser);

// @route   POST /api/auth/login
// @desc    Đăng nhập
// @access  Public
router.post("/login", validateLogin, login);

// @route   GET /api/auth/me
// @desc    Lấy thông tin user hiện tại
// @access  Private
router.get("/me", auth, getMe);

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post("/resend-verification", resendVerificationEmail);

module.exports = router;
