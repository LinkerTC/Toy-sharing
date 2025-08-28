const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { auth } = require("../middleware/auth");

// Tất cả routes đều cần authentication
router.use(auth);

// Gửi tin nhắn mới
router.post("/send", chatController.sendMessage);

// Lấy lịch sử chat giữa 2 người dùng
router.get("/conversation/:otherUserId", chatController.getConversationHistory);

// Lấy danh sách conversation của user hiện tại
router.get("/conversations", chatController.getUserConversations);

// Đánh dấu tin nhắn đã đọc
router.put("/read/:senderId", chatController.markMessagesAsRead);

// Lấy số tin nhắn chưa đọc
router.get("/unread-count", chatController.getUnreadCount);

// Xóa tin nhắn
router.delete("/message/:messageId", chatController.deleteMessage);

module.exports = router;
