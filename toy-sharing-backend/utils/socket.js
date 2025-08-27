// Utility functions for socket operations

const sendNotification = (io, userId, notification) => {
  try {
    io.to(userId.toString()).emit("notification", {
      ...notification,
      timestamp: new Date(),
    });
    console.log(`Notification sent to user ${userId}:`, notification.type);
  } catch (error) {
    console.error(`Failed to send notification to user ${userId}:`, error);
  }
};

const sendMessage = (io, receiverId, message) => {
  try {
    io.to(receiverId.toString()).emit("receive-message", message);
    console.log(`Message sent to user ${receiverId}`);
  } catch (error) {
    console.error(`Failed to send message to user ${receiverId}:`, error);
  }
};

const broadcastToyUpdate = (io, toyData) => {
  try {
    io.emit("toy-updated", toyData);
    console.log(`Toy update broadcasted:`, toyData.id);
  } catch (error) {
    console.error(`Failed to broadcast toy update:`, error);
  }
};

const sendToOwner = (io, ownerId, data) => {
  try {
    io.to(ownerId.toString()).emit("owner-notification", data);
    console.log(`Owner notification sent to ${ownerId}`);
  } catch (error) {
    console.error(`Failed to send owner notification to ${ownerId}:`, error);
  }
};

// New utility functions for better frontend integration
const joinUserRoom = (socket, userId) => {
  try {
    socket.join(userId.toString());
    console.log(`User ${userId} joined their room`);
  } catch (error) {
    console.error(`Failed to join room for user ${userId}:`, error);
  }
};

const leaveUserRoom = (socket, userId) => {
  try {
    socket.leave(userId.toString());
    console.log(`User ${userId} left their room`);
  } catch (error) {
    console.error(`Failed to leave room for user ${userId}:`, error);
  }
};

const broadcastUserStatus = (io, userId, status) => {
  try {
    io.emit("user-status-changed", { userId, status, timestamp: new Date() });
    console.log(`User ${userId} status changed to ${status}`);
  } catch (error) {
    console.error(`Failed to broadcast user status for ${userId}:`, error);
  }
};

const sendRealTimeUpdate = (io, eventType, data) => {
  try {
    io.emit(eventType, {
      ...data,
      timestamp: new Date(),
    });
    console.log(`Real-time update sent: ${eventType}`);
  } catch (error) {
    console.error(`Failed to send real-time update ${eventType}:`, error);
  }
};

const notifyRequestStatusChange = (io, userId, requestData) => {
  try {
    io.to(userId.toString()).emit("request-status-changed", {
      ...requestData,
      timestamp: new Date(),
    });
    console.log(`Request status notification sent to user ${userId}`);
  } catch (error) {
    console.error(`Failed to send request status to user ${userId}:`, error);
  }
};

const sendTypingIndicator = (io, roomId, userId, isTyping) => {
  try {
    io.to(roomId).emit("typing-indicator", { userId, isTyping });
  } catch (error) {
    console.error(`Failed to send typing indicator:`, error);
  }
};

module.exports = {
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
};
