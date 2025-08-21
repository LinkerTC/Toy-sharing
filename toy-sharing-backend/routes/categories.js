const express = require("express");
const Category = require("../models/Category");

const router = express.Router();

// @route   GET /api/categories
// @desc    Lấy danh sách tất cả categories
// @access  Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
});

module.exports = router;
