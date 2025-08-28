const chatService = require("../services/chatService");

class ChatController {
  // Gửi tin nhắn mới
  async sendMessage(req, res) {
    try {
      const { receiverId, content, messageType = "text" } = req.body;
      const senderId = req.user.id;

      if (!receiverId || !content) {
        return res.status(400).json({
          success: false,
          error: {
            code: "MISSING_FIELDS",
            message: "Thiếu thông tin receiverId hoặc content",
          },
        });
      }

      const message = await chatService.sendMessage(
        senderId,
        receiverId,
        content,
        messageType
      );

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "SEND_MESSAGE_ERROR",
          message: error.message,
        },
      });
    }
  }

  // Lấy lịch sử chat giữa 2 người dùng
  async getConversationHistory(req, res) {
    try {
      const { otherUserId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const currentUserId = req.user.id;

      const messages = await chatService.getConversationHistory(
        currentUserId,
        otherUserId,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: messages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: messages.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "GET_HISTORY_ERROR",
          message: error.message,
        },
      });
    }
  }

  // Lấy danh sách conversation của user hiện tại
  async getUserConversations(req, res) {
    try {
      const currentUserId = req.user.id;

      const conversations = await chatService.getUserConversations(
        currentUserId
      );

      res.json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "GET_CONVERSATIONS_ERROR",
          message: error.message,
        },
      });
    }
  }

  // Đánh dấu tin nhắn đã đọc
  async markMessagesAsRead(req, res) {
    try {
      const { senderId } = req.params;
      const currentUserId = req.user.id;

      const result = await chatService.markMessagesAsRead(
        currentUserId,
        senderId
      );

      res.json({
        success: true,
        data: {
          modifiedCount: result.modifiedCount,
          message: "Đã đánh dấu tin nhắn đã đọc",
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "MARK_READ_ERROR",
          message: error.message,
        },
      });
    }
  }

  // Lấy số tin nhắn chưa đọc
  async getUnreadCount(req, res) {
    try {
      const currentUserId = req.user.id;

      const count = await chatService.getUnreadCount(currentUserId);

      res.json({
        success: true,
        data: {
          unreadCount: count,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "GET_UNREAD_COUNT_ERROR",
          message: error.message,
        },
      });
    }
  }

  // Xóa tin nhắn
  async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      const currentUserId = req.user.id;

      const result = await chatService.deleteMessage(messageId, currentUserId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "DELETE_MESSAGE_ERROR",
          message: error.message,
        },
      });
    }
  }
}

module.exports = new ChatController();
