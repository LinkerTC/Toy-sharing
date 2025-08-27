import { useState, useEffect, useCallback } from "react";
import {
  getConversations,
  getMessages,
  sendMessage as sendChatMessage,
  markMessagesAsRead,
  getOrCreateConversation,
  getUnreadCount,
} from "../services/chat";
import { getAllUsers, searchUsers } from "../services/users";
import { useAuth } from "../context/AuthContext";
import socket, {
  connectSocket,
  disconnectSocket,
  sendSocketMessage,
  sendTypingIndicator,
} from "../socket/socket";
import toast from "react-hot-toast";

export const useChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Không thể tải danh sách cuộc trò chuyện");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    try {
      setLoading(true);
      const data = await getMessages(conversationId);
      setMessages(data.messages || []);
      // Mark messages as read
      await markMessagesAsRead(conversationId);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Không thể tải tin nhắn");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (receiverId, message) => {
    try {
      const data = await sendChatMessage(receiverId, message);

      // Emit socket event
      socket.emit("send-message", {
        receiverId,
        message,
        senderId: user?.id,
      });

      // Update local messages
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          message,
          senderId: user?.id,
          receiverId,
          timestamp: new Date(),
          status: "sending",
        },
      ]);

      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Không thể gửi tin nhắn");
      throw error;
    }
  };

  // Start conversation with user
  const startConversation = async (userId) => {
    try {
      const data = await getOrCreateConversation(userId);
      setSelectedConversation(data.conversation);
      await fetchMessages(data.conversation.id);
      return data.conversation;
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Không thể tạo cuộc trò chuyện");
      throw error;
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    }
  };

  // Socket events
  useEffect(() => {
    if (!user) return;

    // Join user to socket
    socket.emit("join", user.id);

    // Listen for new messages
    socket.on("receive-message", (messageData) => {
      setMessages((prev) => {
        // Check if message already exists
        const exists = prev.find((msg) => msg.id === messageData.id);
        if (exists) return prev;

        return [...prev, messageData];
      });

      // Update conversation list
      fetchConversations();
      fetchUnreadCount();
    });

    // Listen for message status updates
    socket.on("message-status", (statusData) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === statusData.messageId
            ? { ...msg, status: statusData.status }
            : msg
        )
      );
    });

    return () => {
      socket.off("receive-message");
      socket.off("message-status");
    };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial load
  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchUnreadCount();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    conversations,
    messages,
    selectedConversation,
    loading,
    unreadCount,
    fetchConversations,
    fetchMessages,
    sendMessage,
    startConversation,
    setSelectedConversation,
    fetchUnreadCount,
  };
};

export const useUserSearch = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all users excluding current user
  const fetchAllUsers = async (params = {}) => {
    try {
      setLoading(true);
      const excludeUsers = [currentUser?.id, ...(params.exclude || [])].filter(
        Boolean
      );
      const data = await getAllUsers({
        ...params,
        exclude: excludeUsers,
      });
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const searchUsersQuery = async (query) => {
    if (!query.trim()) {
      fetchAllUsers();
      return;
    }

    try {
      setLoading(true);
      const excludeUsers = [currentUser?.id].filter(Boolean);
      const data = await searchUsers(query, { exclude: excludeUsers });
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Không thể tìm kiếm người dùng");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchUsersQuery(searchQuery);
      } else {
        fetchAllUsers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    users,
    searchQuery,
    setSearchQuery,
    loading,
    fetchAllUsers,
    searchUsersQuery,
  };
};
