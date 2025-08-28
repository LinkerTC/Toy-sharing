import { io } from "socket.io-client";

class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventListeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  /**
   * Kết nối với chat server
   * @param {string} token - JWT token để xác thực
   * @returns {Promise<boolean>} Kết quả kết nối
   */
  connect(token = null) {
    return new Promise((resolve, reject) => {
      try {
        // Lấy token từ localStorage nếu không được truyền vào
        const authToken = token || localStorage.getItem("token");

        if (!authToken) {
          reject(new Error("Không có token xác thực"));
          return;
        }

        // Tạo kết nối Socket.IO
        this.socket = io("http://localhost:3000", {
          auth: { token: authToken },
          transports: ["polling", "websocket"], // Ưu tiên polling trước, sau đó websocket
          upgrade: true, // Cho phép upgrade từ polling lên websocket
          rememberUpgrade: true, // Ghi nhớ transport đã upgrade
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
          forceNew: true, // Tạo connection mới mỗi lần
          autoConnect: true, // Tự động kết nối
        });

        this.setupEventListeners();
        this.setupReconnectionHandling();

        // Đợi kết nối thành công
        this.socket.once("connect", () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          console.log("✅ Đã kết nối với chat server");
          resolve(true);
        });

        // Xử lý lỗi kết nối
        this.socket.once("connect_error", (error) => {
          console.error("❌ Lỗi kết nối chat server:", error);
          console.error("🔍 Chi tiết lỗi:", {
            message: error.message,
            type: error.type,
            description: error.description,
            context: error.context,
          });
          this.isConnected = false;
          reject(error);
        });

        // Xử lý lỗi transport
        this.socket.on("error", (error) => {
          console.error("❌ Socket transport error:", error);
        });

        // Xử lý upgrade transport
        this.socket.on("upgrade", () => {
          console.log("🔄 Socket transport upgraded to WebSocket");
        });

        // Xử lý downgrade transport
        this.socket.on("downgrade", () => {
          console.log("🔄 Socket transport downgraded to polling");
        });

        // Timeout kết nối
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error("Timeout kết nối chat server"));
          }
        }, 10000);
      } catch (error) {
        console.error("❌ Lỗi khởi tạo chat service:", error);
        reject(error);
      }
    });
  }

  /**
   * Thiết lập các event listeners cơ bản
   */
  setupEventListeners() {
    if (!this.socket) return;

    // Kết nối thành công
    this.socket.on("connect", () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log("✅ Đã kết nối với chat server");
      this.emit("user_online", { timestamp: new Date().toISOString() });
    });

    // Ngắt kết nối
    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
      console.log("❌ Đã ngắt kết nối chat server:", reason);

      if (reason === "io server disconnect") {
        // Server ngắt kết nối, thử kết nối lại
        this.socket.connect();
      }
    });

    // Lỗi socket
    this.socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    // Kết nối lại
    this.socket.on("reconnect", (attemptNumber) => {
      console.log(`✅ Đã kết nối lại sau ${attemptNumber} lần thử`);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    // Lỗi kết nối lại
    this.socket.on("reconnect_error", (error) => {
      console.error("❌ Lỗi kết nối lại:", error);
      this.reconnectAttempts++;
    });

    // Kết nối lại thất bại
    this.socket.on("reconnect_failed", () => {
      console.error("❌ Không thể kết nối lại sau nhiều lần thử");
      this.isConnected = false;
    });
  }

  /**
   * Xử lý kết nối lại tự động
   */
  setupReconnectionHandling() {
    if (!this.socket) return;

    this.socket.on("disconnect", (reason) => {
      if (reason === "io client disconnect") {
        // Client ngắt kết nối có chủ ý, không tự động kết nối lại
        return;
      }

      // Tự động kết nối lại sau một khoảng thời gian
      setTimeout(
        () => {
          if (
            !this.isConnected &&
            this.reconnectAttempts < this.maxReconnectAttempts
          ) {
            console.log(
              `🔄 Đang thử kết nối lại... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`
            );
            this.socket.connect();
          }
        },
        this.reconnectDelay * (this.reconnectAttempts + 1)
      );
    });
  }

  /**
   * Gửi event đến server
   * @param {string} event - Tên event
   * @param {any} data - Dữ liệu gửi
   */
  emit(event, data) {
    if (!this.socket || !this.isConnected) {
      console.warn("⚠️ Socket chưa kết nối, không thể gửi event:", event);
      return false;
    }

    try {
      this.socket.emit(event, data);
      return true;
    } catch (error) {
      console.error("❌ Lỗi gửi event:", event, error);
      return false;
    }
  }

  /**
   * Lắng nghe event từ server
   * @param {string} event - Tên event
   * @param {Function} callback - Hàm xử lý
   */
  on(event, callback) {
    if (!this.socket) {
      console.warn("⚠️ Socket chưa kết nối, không thể lắng nghe event:", event);
      return;
    }

    // Lưu callback để có thể remove sau
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);

    this.socket.on(event, callback);
  }

  /**
   * Lắng nghe event một lần
   * @param {string} event - Tên event
   * @param {Function} callback - Hàm xử lý
   */
  once(event, callback) {
    if (!this.socket) {
      console.warn("⚠️ Socket chưa kết nối, không thể lắng nghe event:", event);
      return;
    }

    this.socket.once(event, callback);
  }

  /**
   * Ngừng lắng nghe event
   * @param {string} event - Tên event
   * @param {Function} callback - Hàm xử lý cụ thể (optional)
   */
  off(event, callback = null) {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback);

      // Xóa callback khỏi danh sách
      if (this.eventListeners.has(event)) {
        const callbacks = this.eventListeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    } else {
      this.socket.off(event);
      this.eventListeners.delete(event);
    }
  }

  /**
   * Gửi tin nhắn
   * @param {string} receiverId - ID người nhận
   * @param {string} content - Nội dung tin nhắn
   * @param {string} messageType - Loại tin nhắn (mặc định: "text")
   * @returns {Promise<Object>} Kết quả gửi tin nhắn
   */
  sendMessage(receiverId, content, messageType = "text") {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error("Socket chưa kết nối"));
        return;
      }

      const messageData = {
        receiverId,
        content,
        messageType,
        timestamp: new Date().toISOString(),
      };

      // Gửi tin nhắn
      this.emit("send_message", messageData);

      // Lắng nghe phản hồi
      this.once("message_sent", (data) => {
        if (data.success) {
          resolve(data.message);
        } else {
          reject(new Error(data.error || "Không thể gửi tin nhắn"));
        }
      });

      // Timeout
      setTimeout(() => {
        reject(new Error("Timeout gửi tin nhắn"));
      }, 10000);
    });
  }

  /**
   * Bắt đầu gõ
   * @param {string} receiverId - ID người nhận
   */
  startTyping(receiverId) {
    this.emit("typing_start", { receiverId });
  }

  /**
   * Dừng gõ
   * @param {string} receiverId - ID người nhận
   */
  stopTyping(receiverId) {
    this.emit("typing_stop", { receiverId });
  }

  /**
   * Đánh dấu tin nhắn đã đọc
   * @param {string} senderId - ID người gửi
   */
  markAsRead(senderId) {
    this.emit("mark_read", { senderId });
  }

  /**
   * Tham gia conversation
   * @param {string} conversationId - ID conversation
   */
  joinConversation(conversationId) {
    this.emit("join_conversation", { conversationId });
  }

  /**
   * Rời conversation
   * @param {string} conversationId - ID conversation
   */
  leaveConversation(conversationId) {
    this.emit("leave_conversation", { conversationId });
  }

  /**
   * Ngắt kết nối
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventListeners.clear();
      console.log("🔌 Đã ngắt kết nối chat server");
    }
  }

  /**
   * Kiểm tra trạng thái kết nối
   * @returns {boolean} Trạng thái kết nối
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * Test kết nối để debug
   * @returns {Promise<Object>} Thông tin kết nối
   */
  testConnection() {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket chưa được khởi tạo"));
        return;
      }

      const connectionInfo = {
        connected: this.socket.connected,
        id: this.socket.id,
        transport: this.socket.io.engine.transport.name,
        readyState: this.socket.io.engine.readyState,
        url: this.socket.io.uri,
        auth: this.socket.auth,
      };

      console.log("🔍 Thông tin kết nối:", connectionInfo);
      resolve(connectionInfo);
    });
  }

  /**
   * Test kết nối để debug
   * @returns {Promise<Object>} Thông tin kết nối
   */
  testConnection() {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket chưa được khởi tạo"));
        return;
      }

      const connectionInfo = {
        connected: this.socket.connected,
        id: this.socket.id,
        transport: this.socket.io.engine.transport.name,
        readyState: this.socket.io.engine.readyState,
        url: this.socket.io.uri,
        auth: this.socket.auth,
      };

      console.log("🔍 Thông tin kết nối:", connectionInfo);
      resolve(connectionInfo);
    });
  }

  /**
   * Lấy socket instance (để debug)
   * @returns {Socket|null} Socket instance
   */
  getSocket() {
    return this.socket;
  }
}

// Tạo instance singleton
const chatService = new ChatService();

export default chatService;
export { ChatService };
