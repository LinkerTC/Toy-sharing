const mongoose = require("mongoose");

const toySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner là bắt buộc"],
    },
    name: {
      type: String,
      required: [true, "Tên đồ chơi là bắt buộc"],
      trim: true,
      maxlength: [100, "Tên đồ chơi không được quá 100 ký tự"],
    },
    description: {
      type: String,
      required: [true, "Mô tả là bắt buộc"],
      trim: true,
      maxlength: [1000, "Mô tả không được quá 1000 ký tự"],
    },
    category: {
      type: String,
      required: [true, "Danh mục là bắt buộc"],
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
        message: "Danh mục không hợp lệ",
      },
    },
    ageGroup: {
      type: String,
      required: [true, "Nhóm tuổi là bắt buộc"],
      enum: {
        values: ["0-2", "3-5", "6-8", "9-12", "13-15"],
        message: "Nhóm tuổi không hợp lệ",
      },
    },
    condition: {
      type: String,
      required: [true, "Tình trạng là bắt buộc"],
      enum: {
        values: ["new", "like-new", "good", "fair"],
        message: "Tình trạng không hợp lệ",
      },
    },
    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
          },
          message: "URL hình ảnh không hợp lệ",
        },
      },
    ],
    status: {
      type: String,
      enum: {
        values: ["available", "borrowed"],
        message: "Trạng thái không hợp lệ",
      },
      default: "available",
    },
    pickupAddress: {
      type: String,
      required: [true, "Địa chỉ nhận đồ là bắt buộc"],
      trim: true,
      maxlength: [200, "Địa chỉ không được quá 200 ký tự"],
    },
    ownerNotes: {
      type: String,
      trim: true,
      maxlength: [500, "Ghi chú không được quá 500 ký tự"],
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

// Indexes cho performance
toySchema.index({ owner: 1 });
toySchema.index({ status: 1, category: 1 });
toySchema.index({ createdAt: -1 });
toySchema.index({ name: "text", description: "text" }); // Text search

// Populate owner info khi query
toySchema.pre(/^find/, function (next) {
  this.populate("owner", "profile stats");
  next();
});

module.exports = mongoose.model("Toy", toySchema);
