# Chat API Documentation

## Tổng quan

Hệ thống chat realtime đơn giản giữa 2 người dùng với các tính năng:

- Gửi/nhận tin nhắn realtime
- Lưu lịch sử tin nhắn
- Typing indicators
- Online/offline status
- Đánh dấu tin nhắn đã đọc

## API Endpoints

### 1. Gửi tin nhắn

```
POST /api/chat/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "user_id_nguoi_nhan",
  "content": "Nội dung tin nhắn",
  "messageType": "text" // optional, default: "text"
}
```

**Response:**

```json
{
  "success": true,
  "message": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "sender": "64f8a1b2c3d4e5f6a7b8c9d1",
    "receiver": "64f8a1b2c3d4e5f6a7b8c9d2",
    "content": "Nội dung tin nhắn",
    "messageType": "text",
    "isRead": false,
    "readAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Lấy danh sách conversation

```
GET /api/chat/conversations
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "conversations": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "otherUser": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "username": "nguyenvanb",
        "fullName": "Nguyễn Văn B",
        "avatar": "https://example.com/avatar2.jpg"
      },
      "lastMessage": {
        "content": "Bạn có thể cho mình mượn đồ chơi được không?",
        "messageType": "text",
        "createdAt": "2024-01-15T10:25:00.000Z"
      },
      "unreadCount": 2,
      "updatedAt": "2024-01-15T10:25:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "otherUser": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d5",
        "username": "tranthic",
        "fullName": "Trần Thị C",
        "avatar": "https://example.com/avatar3.jpg"
      },
      "lastMessage": {
        "content": "Cảm ơn bạn nhiều!",
        "messageType": "text",
        "createdAt": "2024-01-15T09:15:00.000Z"
      },
      "unreadCount": 0,
      "updatedAt": "2024-01-15T09:15:00.000Z"
    }
  ],
  "total": 2
}
```

### 3. Lấy lịch sử chat với một user

```
GET /api/chat/conversation/:otherUserId?page=1&limit=50
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "messages": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d6",
      "sender": "64f8a1b2c3d4e5f6a7b8c9d1",
      "receiver": "64f8a1b2c3d4e5f6a7b8c9d2",
      "content": "Xin chào! Bạn có thể cho mình mượn đồ chơi được không?",
      "messageType": "text",
      "isRead": true,
      "readAt": "2024-01-15T10:20:00.000Z",
      "createdAt": "2024-01-15T10:15:00.000Z",
      "updatedAt": "2024-01-15T10:15:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d7",
      "sender": "64f8a1b2c3d4e5f6a7b8c9d2",
      "receiver": "64f8a1b2c3d4e5f6a7b8c9d1",
      "content": "Chào bạn! Được rồi, bạn muốn mượn gì?",
      "messageType": "text",
      "isRead": true,
      "readAt": "2024-01-15T10:18:00.000Z",
      "createdAt": "2024-01-15T10:17:00.000Z",
      "updatedAt": "2024-01-15T10:17:00.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d8",
      "sender": "64f8a1b2c3d4e5f6a7b8c9d1",
      "receiver": "64f8a1b2c3d4e5f6a7b8c9d2",
      "content": "Mình muốn mượn bộ lego, bạn có không?",
      "messageType": "text",
      "isRead": true,
      "readAt": "2024-01-15T10:19:00.000Z",
      "createdAt": "2024-01-15T10:18:30.000Z",
      "updatedAt": "2024-01-15T10:18:30.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d9",
      "sender": "64f8a1b2c3d4e5f6a7b8c9d2",
      "receiver": "64f8a1b2c3d4e5f6a7b8c9d1",
      "content": "Có rồi! Bạn có thể qua nhà mình lấy vào ngày mai",
      "messageType": "text",
      "isRead": true,
      "readAt": "2024-01-15T10:20:00.000Z",
      "createdAt": "2024-01-15T10:19:30.000Z",
      "updatedAt": "2024-01-15T10:19:30.000Z"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9da",
      "sender": "64f8a1b2c3d4e5f6a7b8c9d1",
      "receiver": "64f8a1b2c3d4e5f6a7b8c9d2",
      "content": "Bạn có thể cho mình mượn đồ chơi được không?",
      "messageType": "text",
      "isRead": false,
      "readAt": null,
      "createdAt": "2024-01-15T10:25:00.000Z",
      "updatedAt": "2024-01-15T10:25:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 5,
    "pages": 1
  },
  "otherUser": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "username": "nguyenvanb",
    "fullName": "Nguyễn Văn B",
    "avatar": "https://example.com/avatar2.jpg",
    "isOnline": true
  }
}
```

### 4. Đánh dấu tin nhắn đã đọc

```
PUT /api/chat/read/:senderId
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Đã đánh dấu tất cả tin nhắn từ người dùng này là đã đọc",
  "updatedCount": 2,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 5. Lấy số tin nhắn chưa đọc

```
GET /api/chat/unread-count
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "unreadCounts": [
    {
      "senderId": "64f8a1b2c3d4e5f6a7b8c9d2",
      "senderName": "Nguyễn Văn B",
      "count": 2
    },
    {
      "senderId": "64f8a1b2c3d4e5f6a7b8c9d5",
      "senderName": "Trần Thị C",
      "count": 1
    }
  ],
  "totalUnread": 3
}
```

### 6. Xóa tin nhắn

```
DELETE /api/chat/message/:messageId
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Đã xóa tin nhắn thành công",
  "deletedMessageId": "64f8a1b2c3d4e5f6a7b8c9d6",
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

## Socket.IO Events

### Kết nối

```javascript
// Kết nối với token xác thực
const socket = io("http://localhost:5000", {
  auth: {
    token: "your_jwt_token",
  },
});
```

### Gửi tin nhắn

```javascript
socket.emit("send_message", {
  receiverId: "user_id_nguoi_nhan",
  content: "Nội dung tin nhắn",
  messageType: "text",
});
```

### Nhận tin nhắn mới

```javascript
socket.on("new_message", (data) => {
  console.log("Tin nhắn mới:", data.message);
  console.log("Từ:", data.sender);
});
```

### Typing indicators

```javascript
// Bắt đầu gõ
socket.emit("typing_start", { receiverId: "user_id" });

// Dừng gõ
socket.emit("typing_stop", { receiverId: "user_id" });

// Nhận thông báo user đang gõ
socket.on("user_typing", (data) => {
  console.log(`${data.username} đang gõ...`);
});

// Nhận thông báo user dừng gõ
socket.on("user_stop_typing", (data) => {
  console.log("User dừng gõ");
});
```

### Đánh dấu tin nhắn đã đọc

```javascript
socket.emit("mark_read", { senderId: "user_id_nguoi_gui" });

// Nhận thông báo tin nhắn đã được đọc
socket.on("messages_read", (data) => {
  console.log(`${data.readerUsername} đã đọc tin nhắn`);
});
```

### Join/Leave conversation

```javascript
// Tham gia conversation
socket.emit("join_conversation", { conversationId: "conv_id" });

// Rời conversation
socket.emit("leave_conversation", { conversationId: "conv_id" });
```

### Online users

```javascript
// Nhận danh sách user online
socket.on("online_users", (userIds) => {
  console.log("Users online:", userIds);
});
```

### Error handling

```javascript
socket.on("error", (error) => {
  console.error("Socket error:", error.message);
});
```

## Frontend Implementation Guide

### 1. Kết nối Socket.IO

```javascript
import { io } from "socket.io-client";

class ChatService {
  constructor(token) {
    this.socket = io("http://localhost:5000", {
      auth: { token },
    });
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on("connect", () => {
      console.log("Connected to chat server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
    });
  }
}
```

### 2. Gửi tin nhắn

```javascript
sendMessage(receiverId, content) {
  return new Promise((resolve, reject) => {
    this.socket.emit('send_message', { receiverId, content });

    this.socket.once('message_sent', (data) => {
      if (data.success) {
        resolve(data.message);
      } else {
        reject(new Error('Failed to send message'));
      }
    });
  });
}
```

### 3. Nhận tin nhắn realtime

```javascript
onNewMessage(callback) {
  this.socket.on('new_message', callback);
}

onTyping(callback) {
  this.socket.on('user_typing', callback);
}

onStopTyping(callback) {
  this.socket.on('user_stop_typing', callback);
}
```

### 4. Quản lý conversation

```javascript
joinConversation(conversationId) {
  this.socket.emit('join_conversation', { conversationId });
}

leaveConversation(conversationId) {
  this.socket.emit('leave_conversation', { conversationId });
}
```

## Database Schema

### Message Model

```javascript
{
  sender: ObjectId,        // ID người gửi
  receiver: ObjectId,      // ID người nhận
  content: String,         // Nội dung tin nhắn
  messageType: String,     // Loại tin nhắn (text, image, file)
  isRead: Boolean,         // Đã đọc chưa
  readAt: Date,           // Thời gian đọc
  createdAt: Date,        // Thời gian tạo
  updatedAt: Date         // Thời gian cập nhật
}
```

## Lưu ý quan trọng

1. **Authentication**: Tất cả API endpoints đều cần JWT token
2. **Socket.IO**: Cần token xác thực khi kết nối
3. **Rate Limiting**: API có rate limiting để tránh spam
4. **Error Handling**: Luôn xử lý lỗi ở frontend
5. **Reconnection**: Tự động kết nối lại khi mất kết nối

## Testing

### Test với Postman

1. Đăng nhập để lấy token
2. Sử dụng token trong header Authorization
3. Test các endpoints chat

### Test Socket.IO

1. Sử dụng Socket.IO client tester
2. Kết nối với token xác thực
3. Test các events

## Troubleshooting

### Lỗi thường gặp

1. **Authentication failed**: Kiểm tra token có hợp lệ không
2. **Connection refused**: Kiểm tra server có chạy không
3. **Message not sent**: Kiểm tra receiverId có tồn tại không

### Debug

1. Kiểm tra console logs
2. Kiểm tra MongoDB connection
3. Kiểm tra Socket.IO events
