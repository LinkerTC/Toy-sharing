const {
  sendNotification,
  sendMessage,
  broadcastToyUpdate,
  sendToOwner,
  joinUserRoom,
  leaveUserRoom,
  broadcastUserStatus,
  sendRealTimeUpdate,
  notifyRequestStatusChange,
  sendTypingIndicator,
} = require("../utils/socket");

// Store active users for better management
const activeUsers = new Map();

const initializeSocketRoutes = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User authentication and room joining
    socket.on("authenticate", (userData) => {
      const { userId, userInfo } = userData;
      socket.userId = userId;
      socket.userInfo = userInfo;

      // Store active user
      activeUsers.set(userId, {
        socketId: socket.id,
        userInfo,
        connectedAt: new Date(),
      });

      joinUserRoom(socket, userId);
      broadcastUserStatus(io, userId, "online");

      // Send current active users to newly connected user
      socket.emit("active-users", Array.from(activeUsers.entries()));
    });

    // Chat message handling
    socket.on("send-message", (data) => {
      const { receiverId, message } = data;
      sendMessage(io, receiverId, {
        ...message,
        senderId: socket.userId,
        timestamp: new Date(),
      });
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { roomId, isTyping } = data;
      sendTypingIndicator(io, roomId, socket.userId, isTyping);
    });

    // Toy request events
    socket.on("toy-request", (requestData) => {
      sendToOwner(io, requestData.ownerId, {
        type: "new-request",
        requestData,
        timestamp: new Date(),
      });
    });

    socket.on("request-response", (data) => {
      const { requesterId, status, requestData } = data;
      notifyRequestStatusChange(io, requesterId, {
        status,
        requestData,
      });
    });

    // Toy updates
    socket.on("toy-updated", (toyData) => {
      broadcastToyUpdate(io, toyData);
    });

    // Generic notification sending
    socket.on("send-notification", (data) => {
      const { userId, notification } = data;
      sendNotification(io, userId, notification);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        leaveUserRoom(socket, socket.userId);
        broadcastUserStatus(io, socket.userId, "offline");
      }
    });

    // Error handling
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  // Return both io instance and helper functions
  return {
    io,
    getActiveUsers: () => Array.from(activeUsers.entries()),
    getUserSocket: (userId) => activeUsers.get(userId),
  };
};

module.exports = { initializeSocketRoutes };
