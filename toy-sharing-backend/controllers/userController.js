const User = require("../models/User");

// @desc    Lấy profile user
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
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
      data: { user },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// @desc    Cập nhật profile user
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;

    // Validate profile data
    const allowedFields = ["firstName", "lastName", "phone", "address"];
    const updateData = {};

    if (profile) {
      Object.keys(profile).forEach((key) => {
        if (allowedFields.includes(key) && profile[key] !== undefined) {
          updateData[`profile.${key}`] = profile[key];
        }
      });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: "NO_UPDATE_DATA",
          message: "Không có dữ liệu để cập nhật",
        },
      });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

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
      data: { user },
      message: "Cập nhật profile thành công",
    });
  } catch (error) {
    console.error("Update profile error:", error);

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

// @desc    Lấy tất cả users
// @route   GET /api/users
// @access  Private
const getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Add search functionality if search parameter is provided
    if (req.query.search) {
      query.email = { $regex: req.query.search, $options: "i" };
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);

    // Get users with pagination
    const users = await User.find(query)
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: {
        users: users.map((user) => ({
          ...user.toObject(),
          isOnline: user.isOnline || false,
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
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
  getProfile,
  updateProfile,
  getAllUser,
};
