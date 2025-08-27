const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    toy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Toy",
      required: [true, "Đồ chơi là bắt buộc"],
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Người mượn là bắt buộc"],
    },
    lender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Người cho mượn là bắt buộc"],
    },
    startDate: {
      type: Date,
      required: [true, "Ngày bắt đầu là bắt buộc"],
      validate: {
        validator: function (v) {
          return v > new Date();
        },
        message: "Ngày bắt đầu phải trong tương lai",
      },
    },
    endDate: {
      type: Date,
      required: [true, "Ngày kết thúc là bắt buộc"],
      validate: {
        validator: function (v) {
          return v > this.startDate;
        },
        message: "Ngày kết thúc phải sau ngày bắt đầu",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["requested", "confirmed", "completed", "cancelled"],
        message: "Trạng thái không hợp lệ",
      },
      default: "requested",
    },
    borrowerMessage: {
      type: String,
      trim: true,
      maxlength: [500, "Tin nhắn không được quá 500 ký tự"],
    },
    lenderResponse: {
      type: String,
      trim: true,
      maxlength: [500, "Phản hồi không được quá 500 ký tự"],
    },
    paymentInfo: {
      amount: {
        type: Number,
        required: [true, "Số tiền thanh toán là bắt buộc"],
        min: [0, "Số tiền không được âm"],
      },
      method: {
        type: String,
        enum: {
          values: ["cash", "bank_transfer", "momo", "zalopay"],
          message: "Phương thức thanh toán không hợp lệ",
        },
        required: [true, "Phương thức thanh toán là bắt buộc"],
      },
      transactionId: {
        type: String,
        required: [true, "Mã giao dịch là bắt buộc"],
      },
      status: {
        type: String,
        enum: {
          values: ["pending", "paid", "failed", "refunded"],
          message: "Trạng thái thanh toán không hợp lệ",
        },
        default: "pending",
      },
      paidAt: {
        type: Date,
      },
    },
    rating: {
      score: {
        type: Number,
        min: [1, "Điểm đánh giá tối thiểu là 1"],
        max: [5, "Điểm đánh giá tối đa là 5"],
      },
      comment: {
        type: String,
        trim: true,
        maxlength: [500, "Bình luận không được quá 500 ký tự"],
      },
      ratedAt: {
        type: Date,
      },
    },
    returnedAt: {
      type: Date,
    },
    autoReturned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes cho performance
bookingSchema.index({ borrower: 1, status: 1 });
bookingSchema.index({ lender: 1, status: 1 });
bookingSchema.index({ toy: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });

// Populate related data khi query
bookingSchema.pre(/^find/, function (next) {
  this.populate("borrower", "profile")
    .populate("lender", "profile")
    .populate("toy", "name images category");
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
