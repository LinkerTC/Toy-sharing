# Hệ Thống Chat Realtime với Socket.IO

## Tổng Quan

Dự án đã được tích hợp hệ thống chat realtime sử dụng Socket.IO, cho phép người dùng trò chuyện theo thời gian thực với các tính năng:

- ✅ Gửi và nhận tin nhắn realtime
- ✅ Typing indicators (hiển thị khi người dùng đang gõ)
- ✅ Đánh dấu tin nhắn đã đọc
- ✅ Trạng thái online/offline
- ✅ Kết nối lại tự động
- ✅ Quản lý conversation realtime
- ✅ UI/UX thân thiện với người dùng

## Cấu Trúc Tích Hợp

### 1. Services

#### `src/services/socket.js`
- **ChatService**: Quản lý kết nối Socket.IO
- **Kết nối tự động**: Tự động kết nối lại khi mất kết nối
- **Event handling**: Xử lý các Socket.IO events
- **Authentication**: Xác thực bằng JWT token

#### `src/services/conversation.js`
- **API calls**: Giao tiếp với backend API
- **Message management**: Quản lý tin nhắn và conversation
- **Read status**: Đánh dấu tin nhắn đã đọc

### 2. Hooks

#### `src/hooks/useChat.js`
- **useConversations**: Quản lý danh sách conversation với realtime updates
- **useRealtimeChat**: Quản lý chat realtime cho một conversation cụ thể
- **useUserSearch**: Tìm kiếm người dùng

### 3. Components

#### `src/components/chat/ChatBox.jsx`
- **Realtime messaging**: Gửi/nhận tin nhắn realtime
- **Typing indicators**: Hiển thị khi người dùng đang gõ
- **Connection status**: Hiển thị trạng thái kết nối
- **Message status**: Hiển thị trạng thái đã gửi/đã đọc

#### `src/components/chat/UserList.jsx`
- **Online status**: Hiển thị người dùng online/offline
- **User search**: Tìm kiếm người dùng
- **Real-time updates**: Cập nhật trạng thái realtime

#### `src/pages/Chat.jsx`
- **Main chat interface**: Giao diện chính của chat
- **Connection monitoring**: Theo dõi trạng thái kết nối
- **Online users count**: Hiển thị số người dùng online

## Cách Sử Dụng

### 1. Kết Nối Chat Server

```javascript
import chatService from '../services/socket';

// Kết nối tự động khi component mount
useEffect(() => {
  const connectToChat = async () => {
    try {
      await chatService.connect();
      console.log('✅ Đã kết nối chat server');
    } catch (error) {
      console.error('❌ Lỗi kết nối:', error);
    }
  };

  connectToChat();
}, []);
```

### 2. Gửi Tin Nhắn

```javascript
const { sendMessage } = useRealtimeChat(receiverId);

const handleSend = async () => {
  try {
    await sendMessage("Nội dung tin nhắn");
    console.log('✅ Đã gửi tin nhắn');
  } catch (error) {
    console.error('❌ Lỗi gửi tin nhắn:', error);
  }
};
```

### 3. Lắng Nghe Tin Nhắn Mới

```javascript
// Tự động được xử lý trong useRealtimeChat hook
// Tin nhắn mới sẽ tự động được thêm vào danh sách messages
```

### 4. Typing Indicators

```javascript
const { handleTyping } = useRealtimeChat(receiverId);

// Tự động gửi typing indicator khi gõ
<input 
  onChange={(e) => {
    setInput(e.target.value);
    handleTyping(); // Gửi typing indicator
  }}
/>
```

### 5. Đánh Dấu Đã Đọc

```javascript
const { markAsRead } = useRealtimeChat(receiverId);

// Tự động được gọi khi mở conversation
useEffect(() => {
  if (receiverId) {
    markAsRead();
  }
}, [receiverId, markAsRead]);
```

## Socket.IO Events

### Client → Server

| Event | Mô tả | Dữ liệu |
|-------|-------|---------|
| `send_message` | Gửi tin nhắn | `{ receiverId, content, messageType }` |
| `typing_start` | Bắt đầu gõ | `{ receiverId }` |
| `typing_stop` | Dừng gõ | `{ receiverId }` |
| `mark_read` | Đánh dấu đã đọc | `{ senderId }` |
| `join_conversation` | Tham gia conversation | `{ conversationId }` |
| `leave_conversation` | Rời conversation | `{ conversationId }` |

### Server → Client

| Event | Mô tả | Dữ liệu |
|-------|-------|---------|
| `new_message` | Tin nhắn mới | `{ message, sender }` |
| `user_typing` | User đang gõ | `{ userId, username }` |
| `user_stop_typing` | User dừng gõ | `{ userId }` |
| `messages_read` | Tin nhắn đã được đọc | `{ senderId, readerUsername }` |
| `online_users` | Danh sách user online | `[userId1, userId2, ...]` |
| `message_sent` | Xác nhận tin nhắn đã gửi | `{ success, message, error? }` |

## Cấu Hình

### 1. Server URL

Mặc định kết nối đến `http://localhost:5000`. Để thay đổi:

```javascript
// Trong src/services/socket.js
this.socket = io("YOUR_SERVER_URL", {
  auth: { token: authToken },
  // ... other options
});
```

### 2. Reconnection Settings

```javascript
// Trong src/services/socket.js
this.maxReconnectAttempts = 5;        // Số lần thử kết nối lại
this.reconnectDelay = 1000;           // Delay giữa các lần thử (ms)
```

### 3. Timeout Settings

```javascript
// Kết nối timeout
timeout: 10000,                        // 10 giây

// Gửi tin nhắn timeout
setTimeout(() => {
  reject(new Error("Timeout gửi tin nhắn"));
}, 10000);                            // 10 giây
```

## Xử Lý Lỗi

### 1. Kết Nối Thất Bại

```javascript
try {
  await chatService.connect();
} catch (error) {
  if (error.message.includes('token')) {
    // Token không hợp lệ
    console.error('Token xác thực không hợp lệ');
  } else if (error.message.includes('timeout')) {
    // Timeout kết nối
    console.error('Kết nối timeout');
  } else {
    // Lỗi khác
    console.error('Lỗi kết nối:', error.message);
  }
}
```

### 2. Gửi Tin Nhắn Thất Bại

```javascript
try {
  await sendMessage(content);
} catch (error) {
  if (error.message.includes('Socket chưa kết nối')) {
    // Socket chưa kết nối
    console.error('Vui lòng kiểm tra kết nối mạng');
  } else if (error.message.includes('timeout')) {
    // Timeout gửi tin nhắn
    console.error('Gửi tin nhắn timeout');
  } else {
    // Lỗi khác
    console.error('Lỗi gửi tin nhắn:', error.message);
  }
}
```

## Tính Năng Nâng Cao

### 1. Typing Debounce

```javascript
// Tự động dừng typing sau 2 giây không gõ
const handleTyping = useCallback(() => {
  startTyping();
  
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }
  
  typingTimeoutRef.current = setTimeout(() => {
    stopTyping();
  }, 2000);
}, [startTyping, stopTyping]);
```

### 2. Auto-scroll Messages

```javascript
// Tự động scroll xuống tin nhắn mới nhất
const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  scrollToBottom();
}, [messages]);
```

### 3. Connection Status Monitoring

```javascript
// Hiển thị trạng thái kết nối realtime
const getConnectionStatusIcon = () => {
  switch (connectionStatus) {
    case "connected":
      return <Wifi className="w-4 h-4 text-green-500" />;
    case "connecting":
      return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />;
    case "error":
      return <WifiOff className="w-4 h-4 text-red-500" />;
    default:
      return <WifiOff className="w-4 h-4 text-gray-400" />;
  }
};
```

## Troubleshooting

### 1. Không Kết Nối Được Chat Server

- Kiểm tra server có đang chạy không
- Kiểm tra URL server có đúng không
- Kiểm tra JWT token có hợp lệ không
- Kiểm tra firewall/network settings

### 2. Tin Nhắn Không Gửi Được

- Kiểm tra trạng thái kết nối socket
- Kiểm tra console errors
- Kiểm tra network tab trong DevTools
- Kiểm tra server logs

### 3. Typing Indicators Không Hoạt Động

- Kiểm tra event listeners có được đăng ký đúng không
- Kiểm tra server có emit events tương ứng không
- Kiểm tra receiverId có đúng không

### 4. Tin Nhắn Không Cập Nhật Realtime

- Kiểm tra socket connection
- Kiểm tra event listeners
- Kiểm tra server có emit events không
- Kiểm tra component có re-render không

## Tương Lai

### Tính Năng Có Thể Thêm

- [ ] File sharing (gửi ảnh, file)
- [ ] Voice messages
- [ ] Video calls
- [ ] Group chat
- [ ] Message reactions
- [ ] Message search
- [ ] Message encryption
- [ ] Push notifications
- [ ] Message history sync
- [ ] Offline message queue

### Tối Ưu Hóa

- [ ] Message pagination
- [ ] Lazy loading conversations
- [ ] Message caching
- [ ] Connection pooling
- [ ] Message compression
- [ ] Rate limiting
- [ ] Error retry logic

## Kết Luận

Hệ thống chat realtime đã được tích hợp hoàn chỉnh với:

- **Realtime messaging**: Gửi/nhận tin nhắn theo thời gian thực
- **Typing indicators**: Hiển thị trạng thái gõ
- **Online status**: Theo dõi người dùng online/offline
- **Auto-reconnection**: Tự động kết nối lại khi mất kết nối
- **Error handling**: Xử lý lỗi một cách graceful
- **UI/UX**: Giao diện thân thiện và responsive

Hệ thống sẵn sàng để sử dụng trong production với khả năng mở rộng và bảo trì cao.
