const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      unique: true,
      trim: true,
      enum: {
        values: [
          "educational",
          "construction",
          "dolls",
          "vehicles",
          "sports",
          "arts_crafts",
          "electronic",
          "other",
        ],
        message: "Tên danh mục không hợp lệ",
      },
    },
    displayName: {
      type: String,
      required: [true, "Tên hiển thị là bắt buộc"],
      trim: true,
      maxlength: [100, "Tên hiển thị không được quá 100 ký tự"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Mô tả không được quá 200 ký tự"],
    },
    icon: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });

module.exports = mongoose.model("Category", categorySchema);
