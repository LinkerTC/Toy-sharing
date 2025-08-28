const Message = require("../models/Message");
const User = require("../models/User");

class ChatService {
  // Gửi tin nhắn mới
  async sendMessage(senderId, receiverId, content, messageType = "text") {
    try {
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
        messageType,
      });

      const savedMessage = await message.save();

      // Populate thông tin sender để trả về
      await savedMessage.populate("sender", "username email avatar");

      return savedMessage;
    } catch (error) {
      throw new Error(`Lỗi gửi tin nhắn: ${error.message}`);
    }
  }

  // Lấy lịch sử chat giữa 2 người dùng
  async getConversationHistory(user1Id, user2Id, page = 1, limit = 50) {
    try {
      const skip = (page - 1) * limit;

      const messages = await Message.find({
        $or: [
          { sender: user1Id, receiver: user2Id },
          { sender: user2Id, receiver: user1Id },
        ],
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "username email avatar")
        .populate("receiver", "username email avatar");

      // Đảo ngược thứ tự để hiển thị từ cũ đến mới
      return messages.reverse();
    } catch (error) {
      throw new Error(`Lỗi lấy lịch sử chat: ${error.message}`);
    }
  }

  // Lấy danh sách conversation của một user
  async getUserConversations(userId) {
    try {
      // Lấy tất cả tin nhắn của user (gửi hoặc nhận)
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: userId }, { receiver: userId }],
          },
        },
        {
          $addFields: {
            otherUser: {
              $cond: {
                if: { $eq: ["$sender", userId] },
                then: "$receiver",
                else: "$sender",
              },
            },
            isOutgoing: { $eq: ["$sender", userId] },
          },
        },
        {
          $group: {
            _id: "$otherUser",
            lastMessage: { $last: "$$ROOT" },
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$receiver", userId] },
                      { $eq: ["$isRead", false] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: { "lastMessage.createdAt": -1 },
        },
      ]);

      // Populate thông tin user khác
      const populatedConversations = await Promise.all(
        conversations.map(async (conv) => {
          const otherUser = await User.findById(conv._id).select(
            "username email avatar"
          );
          return {
            ...conv,
            otherUser,
            conversationId: `${Math.min(
              userId.toString(),
              conv._id.toString()
            )}-${Math.max(userId.toString(), conv._id.toString())}`,
          };
        })
      );

      return populatedConversations;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách conversation: ${error.message}`);
    }
  }

  // Đánh dấu tin nhắn đã đọc
  async markMessagesAsRead(receiverId, senderId) {
    try {
      const result = await Message.updateMany(
        { sender: senderId, receiver: receiverId, isRead: false },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        }
      );

      return result;
    } catch (error) {
      throw new Error(`Lỗi đánh dấu tin nhắn đã đọc: ${error.message}`);
    }
  }

  // Lấy số tin nhắn chưa đọc
  async getUnreadCount(userId) {
    try {
      const count = await Message.countDocuments({
        receiver: userId,
        isRead: false,
      });

      return count;
    } catch (error) {
      throw new Error(`Lỗi lấy số tin nhắn chưa đọc: ${error.message}`);
    }
  }

  // Xóa tin nhắn (chỉ người gửi mới xóa được)
  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error("Tin nhắn không tồn tại");
      }

      if (message.sender.toString() !== userId.toString()) {
        throw new Error("Bạn không có quyền xóa tin nhắn này");
      }

      await Message.findByIdAndDelete(messageId);
      return { success: true, message: "Đã xóa tin nhắn" };
    } catch (error) {
      throw new Error(`Lỗi xóa tin nhắn: ${error.message}`);
    }
  }
}

module.exports = new ChatService();
