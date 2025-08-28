const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const chatService = require("./chatService");

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // Map để lưu user online: userId -> socketId
  }

  // Khởi tạo Socket.IO
  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3001",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupSocketHandlers();
    console.log("✅ Socket.IO initialized");
  }

  // Thiết lập các event handlers
  setupSocketHandlers() {
    this.io.use(async (socket, next) => {
      try {
        // Xác thực token từ query hoặc headers
        const token =
          socket.handshake.auth.token || socket.handshake.query.token;

        if (!token) {
          return next(new Error("Authentication error: No token provided"));
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.username = decoded.username;

        next();
      } catch (error) {
        next(new Error("Authentication error: Invalid token"));
      }
    });

    this.io.on("connection", (socket) => {
      console.log(`🔌 User connected: ${socket.username} (${socket.userId})`);

      // Lưu user vào danh sách online
      this.connectedUsers.set(socket.userId, socket.id);

      // Gửi danh sách user online cho tất cả
      this.broadcastOnlineUsers();

      // Xử lý gửi tin nhắn
      socket.on("send_message", async (data) => {
        try {
          const { receiverId, content, messageType = "text" } = data;

          if (!receiverId || !content) {
            socket.emit("error", {
              message: "Thiếu thông tin receiverId hoặc content",
            });
            return;
          }

          // Lưu tin nhắn vào database
          const savedMessage = await chatService.sendMessage(
            socket.userId,
            receiverId,
            content,
            messageType
          );

          // Gửi tin nhắn cho người nhận nếu online
          const receiverSocketId = this.connectedUsers.get(receiverId);
          if (receiverSocketId) {
            this.io.to(receiverSocketId).emit("new_message", {
              message: savedMessage,
              sender: {
                id: socket.userId,
                username: socket.username,
              },
            });
          }

          // Gửi xác nhận cho người gửi
          socket.emit("message_sent", {
            success: true,
            message: savedMessage,
          });

          // Gửi notification cho người nhận nếu offline
          if (!receiverSocketId) {
            // Có thể gửi push notification ở đây
            console.log(
              `User ${receiverId} is offline, message saved to database`
            );
          }
        } catch (error) {
          socket.emit("error", {
            message: `Lỗi gửi tin nhắn: ${error.message}`,
          });
        }
      });

      // Xử lý typing indicator
      socket.on("typing_start", (data) => {
        const { receiverId } = data;
        const receiverSocketId = this.connectedUsers.get(receiverId);

        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit("user_typing", {
            userId: socket.userId,
            username: socket.username,
          });
        }
      });

      socket.on("typing_stop", (data) => {
        const { receiverId } = data;
        const receiverSocketId = this.connectedUsers.get(receiverId);

        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit("user_stop_typing", {
            userId: socket.userId,
          });
        }
      });

      // Xử lý đánh dấu tin nhắn đã đọc
      socket.on("mark_read", async (data) => {
        try {
          const { senderId } = data;

          await chatService.markMessagesAsRead(socket.userId, senderId);

          // Thông báo cho người gửi biết tin nhắn đã được đọc
          const senderSocketId = this.connectedUsers.get(senderId);
          if (senderSocketId) {
            this.io.to(senderSocketId).emit("messages_read", {
              readerId: socket.userId,
              readerUsername: socket.username,
            });
          }
        } catch (error) {
          socket.emit("error", {
            message: `Lỗi đánh dấu tin nhắn đã đọc: ${error.message}`,
          });
        }
      });

      // Xử lý join vào conversation
      socket.on("join_conversation", (data) => {
        const { conversationId } = data;
        socket.join(conversationId);
        console.log(
          `User ${socket.username} joined conversation: ${conversationId}`
        );
      });

      // Xử lý leave conversation
      socket.on("leave_conversation", (data) => {
        const { conversationId } = data;
        socket.leave(conversationId);
        console.log(
          `User ${socket.username} left conversation: ${conversationId}`
        );
      });

      // Xử lý disconnect
      socket.on("disconnect", () => {
        console.log(
          `🔌 User disconnected: ${socket.username} (${socket.userId})`
        );

        // Xóa user khỏi danh sách online
        this.connectedUsers.delete(socket.userId);

        // Gửi danh sách user online mới cho tất cả
        this.broadcastOnlineUsers();
      });
    });
  }

  // Gửi danh sách user online cho tất cả
  broadcastOnlineUsers() {
    const onlineUsers = Array.from(this.connectedUsers.keys());
    this.io.emit("online_users", onlineUsers);
  }

  // Gửi tin nhắn cho một user cụ thể
  sendToUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Gửi tin nhắn cho tất cả user
  broadcastToAll(event, data) {
    this.io.emit(event, data);
  }

  // Lấy số user đang online
  getOnlineUsersCount() {
    return this.connectedUsers.size;
  }

  // Kiểm tra user có online không
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }
}

module.exports = new SocketService();
