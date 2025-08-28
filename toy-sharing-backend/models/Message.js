const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu truy vấn tin nhắn giữa 2 người
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, isRead: 1 });

// Virtual để lấy conversation ID (sắp xếp theo thứ tự ID để đảm bảo unique)
messageSchema.virtual("conversationId").get(function () {
  const ids = [this.sender.toString(), this.receiver.toString()].sort();
  return `${ids[0]}-${ids[1]}`;
});

// Method để đánh dấu tin nhắn đã đọc
messageSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model("Message", messageSchema);
