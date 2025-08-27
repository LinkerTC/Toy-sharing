const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User là bắt buộc"] },
    toy:  { type: mongoose.Schema.Types.ObjectId, ref: "Toy",  required: [true, "Toy là bắt buộc"] },
    content: { type: String, required: [true, "Nội dung bình luận là bắt buộc"], trim: true, maxlength: [500, "Bình luận không được quá 500 ký tự"] },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // For replies
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Child comments
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
commentSchema.index({ toy: 1, createdAt: -1 });
commentSchema.index({ user: 1 });
commentSchema.index({ isActive: 1 });
commentSchema.index({ parentComment: 1 });

// Virtual for like count
commentSchema.virtual("likeCount").get(function () {
  return Array.isArray(this.likes) ? this.likes.length : 0;
});

// Ensure virtuals are serialized
commentSchema.set("toJSON", { virtuals: true });
commentSchema.set("toObject", { virtuals: true });

// Populate user with _id + profile and replies
commentSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "_id profile" })
      .populate({ 
        path: "replies", 
        populate: { path: "user", select: "_id profile" },
        match: { isActive: true },
        options: { sort: { createdAt: 1 } }
      });
  next();
});

module.exports = mongoose.model("Comment", commentSchema);
