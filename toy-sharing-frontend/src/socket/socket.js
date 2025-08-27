import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

// Tạo socket instance
const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  maxReconnectionAttempts: 5,
  timeout: 20000,
  transports: ["websocket", "polling"],
});

// Event listeners cho connection
socket.on("connect", () => {
  if (import.meta.env.DEV) {
    console.log("✅ Socket connected:", socket.id);
  }
});

socket.on("disconnect", (reason) => {
  if (import.meta.env.DEV) {
    console.log("❌ Socket disconnected:", reason);
  }
});

socket.on("connect_error", (error) => {
  if (import.meta.env.DEV) {
    console.error("🔴 Socket connection error:", error);
  }
});

socket.on("reconnect", (attemptNumber) => {
  if (import.meta.env.DEV) {
    console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
  }
});

socket.on("reconnect_failed", () => {
  if (import.meta.env.DEV) {
    console.error("💥 Socket reconnection failed");
  }
});

// Connect socket
const connectSocket = (userId, userInfo) => {
  if (!socket.connected) {
    socket.connect();
  }

  // Authenticate user after connection
  if (userId && userInfo) {
    socket.emit("authenticate", { userId, userInfo });
  }
};

// Disconnect socket
const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Join user room
const joinUserRoom = (userId) => {
  if (socket.connected && userId) {
    socket.emit("join-room", `user_${userId}`);
  }
};

// Leave user room
const leaveUserRoom = (userId) => {
  if (socket.connected && userId) {
    socket.emit("leave-room", `user_${userId}`);
  }
};

// Send message
const sendSocketMessage = (receiverId, messageData) => {
  if (socket.connected) {
    socket.emit("send-message", {
      receiverId,
      message: messageData,
    });
  }
};

// Send typing indicator
const sendTypingIndicator = (roomId, isTyping = true) => {
  if (socket.connected) {
    socket.emit("typing", {
      roomId,
      isTyping,
    });
  }
};

// Send notification
const sendNotification = (userId, notification) => {
  if (socket.connected) {
    socket.emit("send-notification", {
      userId,
      notification,
    });
  }
};

// Broadcast toy update
const broadcastToyUpdate = (toyData) => {
  if (socket.connected) {
    socket.emit("toy-updated", toyData);
  }
};

// Send toy request
const sendToyRequest = (requestData) => {
  if (socket.connected) {
    socket.emit("toy-request", requestData);
  }
};

// Respond to toy request
const respondToToyRequest = (requesterId, status, requestData) => {
  if (socket.connected) {
    socket.emit("request-response", {
      requesterId,
      status,
      requestData,
    });
  }
};

// Export socket instance and utility functions
export {
  connectSocket,
  disconnectSocket,
  joinUserRoom,
  leaveUserRoom,
  sendSocketMessage,
  sendTypingIndicator,
  sendNotification,
  broadcastToyUpdate,
  sendToyRequest,
  respondToToyRequest,
};

export default socket;
