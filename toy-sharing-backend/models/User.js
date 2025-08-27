const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ",
      ],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    profile: {
      firstName: {
        type: String,
        required: [true, "Tên là bắt buộc"],
        trim: true,
        maxlength: [50, "Tên không được quá 50 ký tự"],
      },
      lastName: {
        type: String,
        required: [true, "Họ là bắt buộc"],
        trim: true,
        maxlength: [50, "Họ không được quá 50 ký tự"],
      },
      phone: {
        type: String,
        trim: true,
        match: [/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"],
      },
      address: {
        type: String,
        trim: true,
        maxlength: [200, "Địa chỉ không được quá 200 ký tự"],
      },
    },
    stats: {
      toysShared: {
        type: Number,
        default: 0,
        min: 0,
      },
      toysBorrowed: {
        type: Number,
        default: 0,
        min: 0,
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Toy",
      },
    ],
  },
  {
    timestamps: true,
  }
);
// Index cho performance
userSchema.index({ email: 1 });

// Hash password trước khi save
userSchema.pre("save", async function (next) {
  // Chỉ hash nếu password được modify
  if (!this.isModified("password")) return next();

  try {
    // Hash password với salt rounds = 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Method để so sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Ẩn password khi convert to JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);
