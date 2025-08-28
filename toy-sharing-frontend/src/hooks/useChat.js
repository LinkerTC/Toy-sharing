import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../services/users";
import chatService from "../services/socket";
import conversationService from "../services/conversation";

export const useUserSearch = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 20,
          search: searchQuery.trim(),
        };

        const result = await getAllUsers(params);

        // Map API response to component format
        const mappedUsers = result.users.map((user) => ({
          id: user._id,
          name: user.fullName,
          username: user.email.split("@")[0], // Lấy username từ email
          email: user.email,
          isOnline: user.isOnline,
          avatar: user.avatar,
          phone: user.phone,
          address: user.address,
          createdAt: user.createdAt,
        }));

        setUsers(mappedUsers);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search query
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset về trang đầu khi search
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentPage]);

  const loadMoreUsers = async () => {
    if (!pagination?.hasNextPage || loading) return;

    setCurrentPage((prev) => prev + 1);
  };

  const refreshUsers = () => {
    setCurrentPage(1);
    setUsers([]);
  };

  return {
    users,
    searchQuery,
    setSearchQuery,
    loading,
    pagination,
    loadMoreUsers,
    refreshUsers,
    hasMore: pagination?.hasNextPage || false,
  };
};

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isConnected, setIsConnected] = useState(false);

  // Kết nối với chat server khi component mount
  useEffect(() => {
    if (!user) return;

    const connectToChat = async () => {
      try {
        await chatService.connect();
        setIsConnected(true);

        // Lắng nghe danh sách user online
        chatService.on("online_users", (userIds) => {
          setOnlineUsers(new Set(userIds));
        });

        // Lắng nghe tin nhắn mới để cập nhật conversation
        chatService.on("new_message", (data) => {
          updateConversationWithNewMessage(data.message);
        });

        // Lắng nghe tin nhắn đã được đọc
        chatService.on("messages_read", (data) => {
          updateConversationReadStatus(data.senderId);
        });
      } catch (error) {
        console.error("❌ Lỗi kết nối chat server:", error);
        setIsConnected(false);
      }
    };

    connectToChat();

    // Cleanup khi component unmount
    return () => {
      chatService.disconnect();
    };
  }, [user]);

  // Cập nhật conversation với tin nhắn mới
  const updateConversationWithNewMessage = useCallback(
    (message) => {
      setConversations((prev) => {
        const existingConvIndex = prev.findIndex(
          (conv) =>
            conv.otherUser.id === message.senderId ||
            conv.otherUser.id === message.receiverId
        );

        if (existingConvIndex >= 0) {
          // Cập nhật conversation hiện tại
          const updatedConv = {
            ...prev[existingConvIndex],
            lastMessage: {
              message: message.content,
              timestamp: message.timestamp,
            },
            unreadCount:
              message.senderId !== user?.id
                ? (prev[existingConvIndex].unreadCount || 0) + 1
                : prev[existingConvIndex].unreadCount || 0,
          };

          const newConversations = [...prev];
          newConversations[existingConvIndex] = updatedConv;

          // Di chuyển conversation lên đầu
          newConversations.unshift(
            newConversations.splice(existingConvIndex, 1)[0]
          );

          return newConversations;
        } else {
          // Tạo conversation mới nếu chưa có
          const newConversation = {
            id: `conv_${Date.now()}`,
            otherUser: {
              id:
                message.senderId === user?.id
                  ? message.receiverId
                  : message.senderId,
              name: message.senderName || "Người dùng",
            },
            lastMessage: {
              message: message.content,
              timestamp: message.timestamp,
            },
            unreadCount: message.senderId !== user?.id ? 1 : 0,
          };

          return [newConversation, ...prev];
        }
      });
    },
    [user?.id]
  );

  // Cập nhật trạng thái đã đọc
  const updateConversationReadStatus = useCallback((senderId) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.otherUser.id === senderId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  }, []);

  // Lấy danh sách conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user || !isConnected) return;

      setLoading(true);
      try {
        // Sử dụng API thực tế thay vì mock data
        const result = await conversationService.getConversations();
        setConversations(result.conversations || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        // Fallback về mock data nếu API lỗi
        const mockConversations = [
          {
            id: "1",
            otherUser: {
              id: "1",
              name: "Nguyễn Văn A",
            },
            lastMessage: {
              message: "Cảm ơn bạn đã cho mượn đồ chơi!",
              timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 phút trước
            },
            unreadCount: 2,
          },
          {
            id: "2",
            otherUser: {
              id: "2",
              name: "Trần Thị B",
            },
            lastMessage: {
              message: "Đồ chơi rất đẹp và chất lượng tốt",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 giờ trước
            },
            unreadCount: 0,
          },
          {
            id: "3",
            otherUser: {
              id: "3",
              name: "Lê Văn C",
            },
            lastMessage: {
              message: "Khi nào bạn có thể giao đồ chơi?",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 ngày trước
            },
            unreadCount: 1,
          },
        ];
        setConversations(mockConversations);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, isConnected]);

  // Đánh dấu tin nhắn đã đọc
  const markAsRead = useCallback(async (senderId) => {
    try {
      await conversationService.markAsRead(senderId);
      chatService.markAsRead(senderId);
      updateConversationReadStatus(senderId);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  }, []);

  return {
    conversations,
    loading,
    onlineUsers,
    isConnected,
    markAsRead,
    updateConversationWithNewMessage,
  };
};

// Hook mới để quản lý chat realtime
export const useRealtimeChat = (receiverId) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const typingTimeoutRef = useRef(null);

  // Kết nối với chat server
  useEffect(() => {
    if (!user || !receiverId) return;

    const connectToChat = async () => {
      try {
        await chatService.connect();
        setConnectionStatus("connected");

        // Lắng nghe tin nhắn mới
        chatService.on("new_message", (data) => {
          // Kiểm tra xem tin nhắn có liên quan đến conversation hiện tại không
          const message = data.message;
          const isRelevantMessage =
            (message.senderId === receiverId &&
              message.receiverId === user?.id) ||
            (message.senderId === user?.id &&
              message.receiverId === receiverId);

          if (isRelevantMessage) {
            // Chuyển đổi format tin nhắn mới
            const formattedMessage = {
              id: message._id || message.id,
              content: message.content,
              messageType: message.messageType,
              senderId: message.senderId || message.sender?._id,
              receiverId: message.receiverId || message.receiver?._id,
              timestamp: message.createdAt || message.timestamp,
              isRead: message.isRead || false,
            };
            setMessages((prev) => [...prev, formattedMessage]);
          }
        });

        // Lắng nghe typing indicators
        chatService.on("user_typing", (data) => {
          if (data.userId === receiverId) {
            setOtherUserTyping(true);
          }
        });

        chatService.on("user_stop_typing", (data) => {
          if (data.userId === receiverId) {
            setOtherUserTyping(false);
          }
        });

        // Lắng nghe tin nhắn đã được đọc
        chatService.on("messages_read", (data) => {
          if (data.senderId === receiverId) {
            // Cập nhật trạng thái đã đọc cho tin nhắn từ receiverId
            setMessages((prev) =>
              prev.map((msg) =>
                msg.senderId === receiverId ? { ...msg, isRead: true } : msg
              )
            );
          }
        });
      } catch (error) {
        console.error("❌ Lỗi kết nối chat:", error);
        setConnectionStatus("error");
      }
    };

    connectToChat();

    return () => {
      // Cleanup
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [user, receiverId]);

  // Lấy lịch sử chat
  useEffect(() => {
    if (!receiverId) return;

    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        const result =
          await conversationService.getConversationHistory(receiverId);

        // Debug: log API response
        console.log("API Response:", result);

        // Chuyển đổi format từ API response sang format component mong đợi
        const formattedMessages = (result.data || []).map((msg) => ({
          id: msg._id,
          content: msg.content,
          messageType: msg.messageType,
          senderId: msg.sender._id,
          receiverId: msg.receiver._id,
          timestamp: msg.createdAt,
          isRead: msg.isRead,
          readAt: msg.readAt,
        }));

        console.log("Formatted Messages:", formattedMessages);
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [receiverId]);

  // Gửi tin nhắn
  const sendMessage = useCallback(
    async (content, messageType = "text") => {
      if (!content.trim() || !receiverId) return;

      try {
        const message = await chatService.sendMessage(
          receiverId,
          content,
          messageType
        );

        // Thêm tin nhắn vào danh sách local
        const newMessage = {
          id: message.id || `msg_${Date.now()}`,
          content,
          messageType,
          senderId: user?.id,
          receiverId,
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        setMessages((prev) => [...prev, newMessage]);

        // Dừng typing indicator
        stopTyping();

        return message;
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
    [receiverId, user?.id]
  );

  // Bắt đầu typing
  const startTyping = useCallback(() => {
    if (!receiverId) return;

    setIsTyping(true);
    chatService.startTyping(receiverId);

    // Clear timeout cũ nếu có
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [receiverId]);

  // Dừng typing
  const stopTyping = useCallback(() => {
    if (!receiverId) return;

    setIsTyping(false);
    chatService.stopTyping(receiverId);

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [receiverId]);

  // Xử lý typing với debounce
  const handleTyping = useCallback(() => {
    startTyping();

    // Dừng typing sau 2 giây không gõ
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [startTyping, stopTyping]);

  // Đánh dấu tin nhắn đã đọc
  const markAsRead = useCallback(async () => {
    if (!receiverId) return;

    try {
      await conversationService.markAsRead(receiverId);
      chatService.markAsRead(receiverId);

      // Cập nhật trạng thái local - đánh dấu tin nhắn từ receiverId là đã đọc
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === receiverId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  }, [receiverId]);

  return {
    messages,
    loading,
    isTyping,
    otherUserTyping,
    connectionStatus,
    sendMessage,
    startTyping,
    stopTyping,
    handleTyping,
    markAsRead,
  };
};
