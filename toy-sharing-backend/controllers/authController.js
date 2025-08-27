const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendVerifyEmail = require("../services/verifycationMail");

// Tạo JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Đăng ký user mới
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, profile } = req.body;

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: "USER_EXISTS",
          message: "Email đã được sử dụng",
        },
      });
    }

    // Tạo user mới
    const user = await User.create({
      email,
      password,
      profile,
    });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    try {
      // Send verification email with OTP
      await sendVerifyEmail(email, otp);

      // Generate login token (shorter expiration)
      const loginToken = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: "Registration successful! Please check your email to verify your account.",
        data: {
          user: {
            id: user._id,
            email: user.email,
            profile: user.profile,
            stats: user.stats,
            createdAt: user.createdAt,
          },
          token: loginToken,
        },
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Still return success but notify about email issue
      res.status(202).json({
        success: true,
        message: "Registration successful, but failed to send verification email. Please try logging in later to resend verification.",
        data: {
          user: {
            id: user._id,
            email: user.email,
            profile: user.profile,
            stats: user.stats,
            createdAt: user.createdAt,
          },
          token: loginToken,
        },
      });
    }

  } catch (error) {
    console.error("Register error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: messages.join(", "),
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isActive) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    user.isActive = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Xác minh thành công" });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isActive) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    if (!user.otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    try {
      await sendVerifyEmail(email, otp);
      res.status(200).json({ success: true, message: "Verification email resent successfully" });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      res.status(500).json({ success: false, message: "Failed to send verification email" });
    }
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user và include password để so sánh
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email hoặc mật khẩu không đúng",
        },
      });
    }

    // Kiểm tra password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email hoặc mật khẩu không đúng",
        },
      });
    }

    // Tạo token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          stats: user.stats,
          createdAt: user.createdAt,
        },
        token,
      },
      message: "Đăng nhập thành công",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "Không tìm thấy user",
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          profile: user.profile,
          stats: user.stats,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  verifyUser,
  resendVerificationEmail,
};
