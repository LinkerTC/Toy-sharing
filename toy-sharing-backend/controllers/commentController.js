const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Toy = require("../models/Toy");

// @desc    Lấy danh sách bình luận của một đồ chơi
// @route   GET /api/comments/:toyId
// @access  Public
const getComments = async (req, res) => {
  try {
    const { toyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(toyId)) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_TOY_ID", message: "ID đồ chơi không hợp lệ" },
      });
    }

    // Kiểm tra đồ chơi có tồn tại không
    const toy = await Toy.findOne({ _id: toyId, isActive: true });
    if (!toy) {
      return res.status(404).json({
        success: false,
        error: { code: "TOY_NOT_FOUND", message: "Không tìm thấy đồ chơi" },
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const comments = await Comment.find({ toy: toyId, isActive: true, parentComment: null })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .populate("user", "profile");

    const total = await Comment.countDocuments({ toy: toyId, isActive: true });
    const totalPages = Math.ceil(total / Number(limit));

    return res.status(200).json({
      success: true,
      data: {
        comments,
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
    console.error("Get comments error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Lỗi server" },
    });
  }
};

// @desc    Tạo bình luận mới hoặc reply
// @route   POST /api/comments/:toyId
// @access  Private
const createComment = async (req, res) => {
  try {
    const { toyId } = req.params;
    const { content, parentCommentId } = req.body;

    if (!mongoose.isValidObjectId(toyId)) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_TOY_ID", message: "ID đồ chơi không hợp lệ" },
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_CONTENT", message: "Nội dung bình luận là bắt buộc" },
      });
    }

    // Kiểm tra đồ chơi có tồn tại không
    const toy = await Toy.findOne({ _id: toyId, isActive: true });
    if (!toy) {
      return res.status(404).json({
        success: false,
        error: { code: "TOY_NOT_FOUND", message: "Không tìm thấy đồ chơi" },
      });
    }

    // Nếu có parentCommentId, kiểm tra comment cha có tồn tại không
    let parentComment = null;
    if (parentCommentId) {
      if (!mongoose.isValidObjectId(parentCommentId)) {
        return res.status(400).json({
          success: false,
          error: { code: "INVALID_PARENT_COMMENT_ID", message: "ID bình luận cha không hợp lệ" },
        });
      }
      
      parentComment = await Comment.findOne({ 
        _id: parentCommentId, 
        toy: toyId, 
        isActive: true,
        parentComment: null // Chỉ cho phép reply vào comment gốc, không nested
      });
      
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          error: { code: "PARENT_COMMENT_NOT_FOUND", message: "Không tìm thấy bình luận cha" },
        });
      }
    }

    const comment = await Comment.create({
      user: req.user._id,
      toy: toyId,
      content: content.trim(),
      parentComment: parentCommentId || null,
    });

    // Nếu là reply, thêm vào danh sách replies của comment cha
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    await comment.populate("user", "profile");

    return res.status(201).json({
      success: true,
      data: { comment },
      message: "Tạo bình luận thành công",
    });
  } catch (error) {
    console.error("Create comment error:", error);
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

// @desc    Cập nhật bình luận
// @route   PUT /api/comments/:id
// @access  Private (Owner only)
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_COMMENT_ID", message: "ID bình luận không hợp lệ" },
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_CONTENT", message: "Nội dung bình luận là bắt buộc" },
      });
    }

    const comment = await Comment.findOne({
      _id: id,
      user: req.user._id,
      isActive: true,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: {
          code: "COMMENT_NOT_FOUND",
          message: "Không tìm thấy bình luận hoặc bạn không có quyền sửa",
        },
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content: content.trim() },
      { new: true, runValidators: true }
    ).populate("user", "profile");

    return res.status(200).json({
      success: true,
      data: { comment: updatedComment },
      message: "Cập nhật bình luận thành công",
    });
  } catch (error) {
    console.error("Update comment error:", error);
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

// @desc    Xóa bình luận
// @route   DELETE /api/comments/:id
// @access  Private (Owner only)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_COMMENT_ID", message: "ID bình luận không hợp lệ" },
      });
    }

    const comment = await Comment.findOne({
      _id: id,
      user: req.user._id,
      isActive: true,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: {
          code: "COMMENT_NOT_FOUND",
          message: "Không tìm thấy bình luận hoặc bạn không có quyền xóa",
        },
      });
    }

    // Xóa comment
    await Comment.findByIdAndUpdate(id, { isActive: false });

    // Nếu là comment mẹ (parentComment = null), xóa tất cả replies
    if (!comment.parentComment) {
      await Comment.updateMany(
        { parentComment: id, isActive: true },
        { isActive: false }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Xóa bình luận thành công",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Lỗi server" },
    });
  }
};

// @desc    Like/Unlike bình luận
// @route   POST /api/comments/:id/like
// @access  Private
const toggleLikeComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_COMMENT_ID", message: "ID bình luận không hợp lệ" },
      });
    }

    const comment = await Comment.findOne({ _id: id, isActive: true });
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { code: "COMMENT_NOT_FOUND", message: "Không tìm thấy bình luận" },
      });
    }

    const userId = req.user._id;
    const hasLiked = comment.likes.includes(userId);

    let updatedComment;
    if (hasLiked) {
      // Unlike
      updatedComment = await Comment.findByIdAndUpdate(
        id,
        { $pull: { likes: userId } },
        { new: true }
      ).populate("user", "profile");
    } else {
      // Like
      updatedComment = await Comment.findByIdAndUpdate(
        id,
        { $addToSet: { likes: userId } },
        { new: true }
      ).populate("user", "profile");
    }

    return res.status(200).json({
      success: true,
      data: { 
        comment: updatedComment,
        action: hasLiked ? "unliked" : "liked"
      },
      message: hasLiked ? "Đã bỏ thích bình luận" : "Đã thích bình luận",
    });
  } catch (error) {
    console.error("Toggle like comment error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Lỗi server" },
    });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
};
