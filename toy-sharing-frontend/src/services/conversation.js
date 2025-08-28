import api from "./api.js";

/**
 * Service để xử lý các API liên quan đến chat và conversation
 */
class ConversationService {
  /**
   * Gửi tin nhắn mới
   * @param {Object} messageData - Dữ liệu tin nhắn
   * @param {string} messageData.receiverId - ID người nhận
   * @param {string} messageData.content - Nội dung tin nhắn
   * @param {string} messageData.messageType - Loại tin nhắn (mặc định: "text")
   * @returns {Promise<Object>} Kết quả gửi tin nhắn
   */
  async sendMessage(messageData) {
    try {
      const response = await api.post("/chat/send", {
        receiverId: messageData.receiverId,
        content: messageData.content,
        messageType: messageData.messageType || "text",
      });
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi gửi tin nhắn: ${error.message}`);
    }
  }

  /**
   * Lấy danh sách conversation
   * @returns {Promise<Object>} Danh sách conversation
   */
  async getConversations() {
    try {
      const response = await api.get("/chat/conversations");
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách conversation: ${error.message}`);
    }
  }

  /**
   * Lấy lịch sử chat với một user cụ thể
   * @param {string} otherUserId - ID của user khác
   * @param {number} page - Trang hiện tại (mặc định: 1)
   * @param {number} limit - Số tin nhắn mỗi trang (mặc định: 50)
   * @returns {Promise<Object>} Lịch sử chat và thông tin user
   */
  async getConversationHistory(otherUserId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/chat/conversation/${otherUserId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi lấy lịch sử chat: ${error.message}`);
    }
  }

  /**
   * Đánh dấu tin nhắn đã đọc từ một user
   * @param {string} senderId - ID của người gửi
   * @returns {Promise<Object>} Kết quả đánh dấu đã đọc
   */
  async markAsRead(senderId) {
    try {
      const response = await api.put(`/chat/read/${senderId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi đánh dấu đã đọc: ${error.message}`);
    }
  }

  /**
   * Lấy số tin nhắn chưa đọc
   * @returns {Promise<Object>} Thống kê tin nhắn chưa đọc
   */
  async getUnreadCount() {
    try {
      const response = await api.get("/chat/unread-count");
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi lấy số tin nhắn chưa đọc: ${error.message}`);
    }
  }

  /**
   * Xóa tin nhắn
   * @param {string} messageId - ID của tin nhắn cần xóa
   * @returns {Promise<Object>} Kết quả xóa tin nhắn
   */
  async deleteMessage(messageId) {
    try {
      const response = await api.delete(`/chat/message/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi xóa tin nhắn: ${error.message}`);
    }
  }

  /**
   * Lấy conversation mới nhất (để cập nhật real-time)
   * @param {string} conversationId - ID của conversation
   * @returns {Promise<Object>} Thông tin conversation cập nhật
   */
  async getConversationById(conversationId) {
    try {
      const response = await api.get(`/chat/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin conversation: ${error.message}`);
    }
  }

  /**
   * Tìm kiếm conversation theo tên user
   * @param {string} searchTerm - Từ khóa tìm kiếm
   * @returns {Promise<Object>} Kết quả tìm kiếm
   */
  async searchConversations(searchTerm) {
    try {
      const response = await api.get("/chat/conversations/search", {
        params: { q: searchTerm },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi tìm kiếm conversation: ${error.message}`);
    }
  }

  /**
   * Lấy thông tin user trong conversation
   * @param {string} userId - ID của user
   * @returns {Promise<Object>} Thông tin user
   */
  async getUserInfo(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi lấy thông tin user: ${error.message}`);
    }
  }
}

// Export instance mặc định
const conversationService = new ConversationService();
export default conversationService;

// Export class để có thể tạo instance mới nếu cần
export { ConversationService };
