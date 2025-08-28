const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  verifyUser,
  resendVerificationEmail,
  changePassword,
  forgotPassword,
  verifyForgotPassword,
  googleLogin,
} = require("../controllers/authController");
const {
  validateRegistration,
  validateLogin,
} = require("../middleware/validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/auth/google
// @desc    Google login
// @access  Public
router.post("/google", googleLogin);

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

// @route   POST /api/auth/logout
// @desc    Đăng xuất
// @access  Private
router.post("/logout", auth, logout);

// @route   GET /api/auth/me
// @desc    Lấy thông tin user hiện tại
// @access  Private
router.get("/me", auth, getMe);

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post("/resend-verification", resendVerificationEmail);

// @route   PUT /api/auth/change-password
// @desc    Đổi mật khẩu
// @access  Private
router.put("/change-password", auth, changePassword);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/verify-forgot-password
// @desc    Verify forgot password
// @access  Public
router.post("/verify-forgot-password", verifyForgotPassword);

module.exports = router;
