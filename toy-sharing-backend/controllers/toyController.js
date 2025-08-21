const Toy = require("../models/Toy");
const User = require("../models/User");

// @desc    Lấy danh sách tất cả đồ chơi
// @route   GET /api/toys
// @access  Public
const getToys = async (req, res) => {
  try {
    const {
      search,
      category,
      ageGroup,
      condition,
      status = "available",
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by age group
    if (ageGroup) {
      query.ageGroup = ageGroup;
    }

    // Filter by condition
    if (condition) {
      query.condition = condition;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const toys = await Toy.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("owner", "profile stats");

    // Get total count for pagination
    const total = await Toy.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        toys,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get toys error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// @desc    Lấy chi tiết một đồ chơi
// @route   GET /api/toys/:id
// @access  Public
const getToy = async (req, res) => {
  try {
    const toy = await Toy.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("owner", "profile stats");

    if (!toy) {
      return res.status(404).json({
        success: false,
        error: {
          code: "TOY_NOT_FOUND",
          message: "Không tìm thấy đồ chơi",
        },
      });
    }

    res.status(200).json({
      success: true,
      data: { toy },
    });
  } catch (error) {
    console.error("Get toy error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// @desc    Tạo đồ chơi mới
// @route   POST /api/toys
// @access  Private
const createToy = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      ageGroup,
      condition,
      images,
      pickupAddress,
      ownerNotes,
    } = req.body;

    // Tạo toy mới
    const toy = await Toy.create({
      owner: req.user._id,
      name,
      description,
      category,
      ageGroup,
      condition,
      images: images || [],
      pickupAddress,
      ownerNotes,
    });

    // Cập nhật stats của user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.toysShared": 1 },
    });

    // Populate owner info
    await toy.populate("owner", "profile stats");

    res.status(201).json({
      success: true,
      data: { toy },
      message: "Tạo đồ chơi thành công",
    });
  } catch (error) {
    console.error("Create toy error:", error);

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

// @desc    Cập nhật đồ chơi
// @route   PUT /api/toys/:id
// @access  Private (Owner only)
const updateToy = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      ageGroup,
      condition,
      images,
      pickupAddress,
      ownerNotes,
    } = req.body;

    // Tìm toy và kiểm tra ownership
    const toy = await Toy.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isActive: true,
    });

    if (!toy) {
      return res.status(404).json({
        success: false,
        error: {
          code: "TOY_NOT_FOUND",
          message: "Không tìm thấy đồ chơi hoặc bạn không có quyền chỉnh sửa",
        },
      });
    }

    // Không cho phép cập nhật nếu toy đang được mượn
    if (toy.status === "borrowed") {
      return res.status(400).json({
        success: false,
        error: {
          code: "TOY_BORROWED",
          message: "Không thể cập nhật đồ chơi đang được mượn",
        },
      });
    }

    // Cập nhật các trường
    const updateFields = {
      name,
      description,
      category,
      ageGroup,
      condition,
      images,
      pickupAddress,
      ownerNotes,
    };

    // Loại bỏ các field undefined
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    const updatedToy = await Toy.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "profile stats");

    res.status(200).json({
      success: true,
      data: { toy: updatedToy },
      message: "Cập nhật đồ chơi thành công",
    });
  } catch (error) {
    console.error("Update toy error:", error);

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

// @desc    Xóa đồ chơi
// @route   DELETE /api/toys/:id
// @access  Private (Owner only)
const deleteToy = async (req, res) => {
  try {
    // Tìm toy và kiểm tra ownership
    const toy = await Toy.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isActive: true,
    });

    if (!toy) {
      return res.status(404).json({
        success: false,
        error: {
          code: "TOY_NOT_FOUND",
          message: "Không tìm thấy đồ chơi hoặc bạn không có quyền xóa",
        },
      });
    }

    // Không cho phép xóa nếu toy đang được mượn
    if (toy.status === "borrowed") {
      return res.status(400).json({
        success: false,
        error: {
          code: "TOY_BORROWED",
          message: "Không thể xóa đồ chơi đang được mượn",
        },
      });
    }

    // Soft delete - chỉ set isActive = false
    await Toy.findByIdAndUpdate(req.params.id, { isActive: false });

    // Giảm stats của user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.toysShared": -1 },
    });

    res.status(200).json({
      success: true,
      message: "Xóa đồ chơi thành công",
    });
  } catch (error) {
    console.error("Delete toy error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// @desc    Lấy đồ chơi của user hiện tại
// @route   GET /api/toys/my-toys
// @access  Private
const getMyToys = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = {
      owner: req.user._id,
      isActive: true,
    };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const toys = await Toy.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Toy.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        toys,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get my toys error:", error);
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
  getToys,
  getToy,
  createToy,
  updateToy,
  deleteToy,
  getMyToys,
};
