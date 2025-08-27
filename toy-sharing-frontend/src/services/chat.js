import api from "./api";

// Lấy danh sách cuộc trò chuyện
export const getConversations = async (params = {}) => {
  try {
    const { page = 1, limit = 20 } = params;
    const response = await api.get("/chat/conversations", {
      params: { page, limit },
    });
    return {
      conversations: response.data.data || response.data.conversations || [],
      total: response.data.total || 0,
      currentPage: response.data.currentPage || page,
      totalPages: response.data.totalPages || 1,
      hasMore: response.data.hasMore || false,
    };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return {
      conversations: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
      hasMore: false,
    };
  }
};

// Lấy tin nhắn của một cuộc trò chuyện
export const getMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    const response = await api.get(
      `/chat/conversations/${conversationId}/messages`,
      {
        params: { page, limit },
      }
    );
    return {
      messages: response.data.data || response.data.messages || [],
      total: response.data.total || 0,
      currentPage: response.data.currentPage || page,
      totalPages: response.data.totalPages || 1,
      hasMore: response.data.hasMore || false,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      messages: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
      hasMore: false,
    };
  }
};

// Gửi tin nhắn
export const sendMessage = async (receiverId, message, type = "text") => {
  try {
    const response = await api.post("/chat/messages", {
      receiverId,
      message,
      type,
    });
    return {
      message: response.data.data || response.data.message || null,
      success: response.data.success || true,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Tạo cuộc trò chuyện mới hoặc lấy cuộc trò chuyện hiện có
export const getOrCreateConversation = async (userId) => {
  try {
    const response = await api.post("/chat/conversations", { userId });
    return {
      conversation: response.data.data || response.data.conversation || null,
      isNew: response.data.isNew || false,
    };
  } catch (error) {
    console.error("Error creating/getting conversation:", error);
    throw error;
  }
};

// Đánh dấu tin nhắn đã đọc
export const markMessagesAsRead = async (conversationId) => {
  try {
    const response = await api.patch(
      `/chat/conversations/${conversationId}/read`
    );
    return {
      success: response.data.success || true,
      unreadCount: response.data.unreadCount || 0,
    };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { success: false, unreadCount: 0 };
  }
};

// Lấy số tin nhắn chưa đọc
export const getUnreadCount = async () => {
  try {
    const response = await api.get("/chat/unread-count");
    return {
      count: response.data.data?.count || response.data.count || 0,
      conversations: response.data.data?.conversations || [],
    };
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return { count: 0, conversations: [] };
  }
};

// Xóa cuộc trò chuyện
export const deleteConversation = async (conversationId) => {
  try {
    const response = await api.delete(`/chat/conversations/${conversationId}`);
    return {
      success: response.data.success || true,
      message: response.data.message || "Đã xóa cuộc trò chuyện",
    };
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

// Lấy lịch sử chat với một người dùng cụ thể
export const getChatHistory = async (userId, params = {}) => {
  try {
    const { page = 1, limit = 50 } = params;
    const response = await api.get(`/chat/history/${userId}`, {
      params: { page, limit },
    });
    return {
      messages: response.data.data || response.data.messages || [],
      total: response.data.total || 0,
      currentPage: response.data.currentPage || page,
      totalPages: response.data.totalPages || 1,
      hasMore: response.data.hasMore || false,
    };
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return {
      messages: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
      hasMore: false,
    };
  }
};

// Cập nhật trạng thái typing
export const updateTypingStatus = async (conversationId, isTyping = true) => {
  try {
    const response = await api.post(`/chat/typing/${conversationId}`, {
      isTyping,
    });
    return {
      success: response.data.success || true,
    };
  } catch (error) {
    console.error("Error updating typing status:", error);
    return { success: false };
  }
};
