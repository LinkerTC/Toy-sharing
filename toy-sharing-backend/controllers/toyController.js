const mongoose = require("mongoose");
const Toy = require("../models/Toy");
const User = require("../models/User");
const Category = require("../models/Category");

// helper: map query.category (ObjectId hoặc name) → ObjectId
async function normalizeCategoryFilter(input) {
  if (!input) return null;
  if (mongoose.isValidObjectId(input)) return input;
  const cat = await Category.findOne({ name: input, isActive: true }).select(
    "_id"
  );
  return cat ? cat._id : null;
}

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
      priceMin,
      priceMax,
    } = req.query;

    const query = { isActive: true };
    if (status) query.status = status;
    if (ageGroup) query.ageGroup = ageGroup;
    if (condition) query.condition = condition;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // category as ObjectId or name
    if (category) {
      const catId = await normalizeCategoryFilter(category);
      if (catId) query.category = catId;
      else query.category = null; // không tìm thấy → kết quả rỗng
    }

    // price range
    if (priceMin !== undefined || priceMax !== undefined) {
      query.price = {};
      if (priceMin !== undefined) query.price.$gte = Number(priceMin);
      if (priceMax !== undefined) query.price.$lte = Number(priceMax);
    }

    const allowedSort = new Set(["createdAt", "price", "name", "status"]);
    const sort = {
      [allowedSort.has(sortBy) ? sortBy : "createdAt"]:
        sortOrder === "asc" ? 1 : -1,
    };

    const skip = (Number(page) - 1) * Number(limit);

    const toys = await Toy.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip(skip)
      .populate("owner", "profile stats")
      .populate("category", "name displayName icon");

    const total = await Toy.countDocuments(query);
    const totalPages = Math.ceil(total / Number(limit));

    return res.status(200).json({
      success: true,
      data: {
        toys,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems: total,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get toys error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Lỗi server" },
    });
  }
};

// @desc    Lấy chi tiết một đồ chơi
// @route   GET /api/toys/:id
// @access  Public
const getToy = async (req, res) => {
  try {
    const toy = await Toy.findOne({ _id: req.params.id, isActive: true })
      .populate("owner", "profile stats")
      .populate("category", "name displayName icon");

    if (!toy) {
      return res.status(404).json({
        success: false,
        error: { code: "TOY_NOT_FOUND", message: "Không tìm thấy đồ chơi" },
      });
    }

    return res.status(200).json({ success: true, data: { toy } });
  } catch (error) {
    console.error("Get toy error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Lỗi server" },
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
      category, // ObjectId
      ageGroup,
      condition,
      images,
      pickupAddress,
      ownerNotes,
      price, // NEW
    } = req.body;

    if (!mongoose.isValidObjectId(category)) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_CATEGORY", message: "Category không hợp lệ" },
      });
    }
    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_PRICE", message: "Giá không hợp lệ" },
      });
    }

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
      price: Number(price),
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.toysShared": 1 },
    });
    await toy.populate("owner", "profile stats");
    await toy.populate("category", "name displayName icon");

    return res.status(201).json({
      success: true,
      data: { toy },
      message: "Tạo đồ chơi thành công",
    });
  } catch (error) {
    console.error("Create toy error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: messages.join(", ") },
      });
    }
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Lỗi server" },
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
      category, // optional ObjectId
      ageGroup,
      condition,
      images,
      pickupAddress,
      ownerNotes,
      price, // optional Number >= 0
    } = req.body;

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
          message: "Không tìm thấy đồ chơi hoặc không có quyền",
        },
      });
    }
    if (toy.status === "borrowed") {
      return res.status(400).json({
        success: false,
        error: {
          code: "TOY_BORROWED",
          message: "Không thể cập nhật đồ chơi đang mượn",
        },
      });
    }
    if (category !== undefined && !mongoose.isValidObjectId(category)) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_CATEGORY", message: "Category không hợp lệ" },
      });
    }
    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_PRICE", message: "Giá không hợp lệ" },
      });
    }

    const updateFields = {
      name,
      description,
      ageGroup,
      condition,
      images,
      pickupAddress,
      ownerNotes,
    };
    if (category !== undefined) updateFields.category = category;
    if (price !== undefined) updateFields.price = Number(price);
    Object.keys(updateFields).forEach(
      (k) => updateFields[k] === undefined && delete updateFields[k]
    );

    const updatedToy = await Toy.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate("owner", "profile stats")
      .populate("category", "name displayName icon");

    return res.status(200).json({
      success: true,
      data: { toy: updatedToy },
      message: "Cập nhật đồ chơi thành công",
    });
  } catch (error) {
    console.error("Update toy error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: messages.join(", ") },
      });
    }
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Lỗi server" },
    });
  }
};

// @desc    Xóa đồ chơi
// @route   DELETE /api/toys/:id
// @access  Private (Owner only)
const deleteToy = async (req, res) => {
  try {
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
    if (toy.status === "borrowed") {
      return res.status(400).json({
        success: false,
        error: {
          code: "TOY_BORROWED",
          message: "Không thể xóa đồ chơi đang được mượn",
        },
      });
    }

    await Toy.findByIdAndUpdate(req.params.id, { isActive: false });
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.toysShared": -1 },
    });

    return res
      .status(200)
      .json({ success: true, message: "Xóa đồ chơi thành công" });
  } catch (error) {
    console.error("Delete toy error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Lỗi server" },
    });
  }
};

// @desc    Lấy đồ chơi của user hiện tại
// @route   GET /api/toys/my-toys
// @access  Private
const getMyToys = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priceMin, priceMax } = req.query;

    const query = { owner: req.user._id, isActive: true };
    if (status) query.status = status;

    if (priceMin !== undefined || priceMax !== undefined) {
      query.price = {};
      if (priceMin !== undefined) query.price.$gte = Number(priceMin);
      if (priceMax !== undefined) query.price.$lte = Number(priceMax);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const toys = await Toy.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .populate("category", "name displayName icon");

    const total = await Toy.countDocuments(query);
    const totalPages = Math.ceil(total / Number(limit));

    return res.status(200).json({
      success: true,
      data: {
        toys,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems: total,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get my toys error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Lỗi server" },
    });
  }
};

// @desc    Lấy danh sách category đang hoạt động
// @route   GET /api/toys/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).select(
      "_id name displayName description icon isActive createdAt updatedAt"
    );

    return res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Lỗi server" },
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
  getCategories,
};
