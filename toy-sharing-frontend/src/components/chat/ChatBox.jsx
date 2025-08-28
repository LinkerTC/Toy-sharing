import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { useRealtimeChat } from "../../hooks/useChat";
import { useAuth } from "../../context/AuthContext";

const ChatBox = ({ userId, receiverId, receiverName }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Debug: log props
  console.log("ChatBox Props:", { userId, receiverId, receiverName });

  // Sử dụng auth hook để lấy user object
  const { user } = useAuth();

  // Sử dụng realtime chat hook
  const {
    messages,
    loading,
    isTyping,
    otherUserTyping,
    connectionStatus,
    sendMessage,
    handleTyping,
    markAsRead,
  } = useRealtimeChat(receiverId);

  // Auto-scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Đánh dấu tin nhắn đã đọc khi component mount
  useEffect(() => {
    if (receiverId) {
      markAsRead();
    }
  }, [receiverId, markAsRead]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !receiverId) return;

    try {
      await sendMessage(input.trim());
      setInput("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      // Có thể hiển thị toast error ở đây
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    handleTyping();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Đang hoạt động";
      case "connecting":
        return "Đang kết nối...";
      case "error":
        return "Lỗi kết nối";
      default:
        return "Chưa kết nối";
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-600";
      case "connecting":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải tin nhắn...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      {receiverName && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {receiverName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{receiverName}</h3>
                <div className="flex items-center space-x-2">
                  {getConnectionStatusIcon()}
                  <p className={`text-sm ${getConnectionStatusColor()}`}>
                    {getConnectionStatusText()}
                  </p>
                </div>
              </div>
            </div>

            {/* Connection Status Badge */}
            {connectionStatus === "error" && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-red-50 border border-red-200 rounded-full">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-600">Lỗi kết nối</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Typing Indicator */}
      {otherUserTyping && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-sm text-gray-500">
              {receiverName} đang gõ...
            </span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, idx) => {
            // Debug: log để kiểm tra dữ liệu
            console.log("Message:", msg);
            console.log("userId:", userId);
            console.log("msg.senderId:", msg.senderId);

            const isOwnMessage =
              msg.senderId === userId ||
              msg.senderId === user?._id ||
              msg.senderId === user?.id;
            return (
              <div
                key={msg.id || idx}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl ${
                    isOwnMessage
                      ? "bg-primary-500 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p
                      className={`text-xs ${
                        isOwnMessage ? "text-primary-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                    {isOwnMessage && (
                      <div className="flex items-center space-x-1">
                        {msg.isRead ? (
                          <span className="text-xs text-primary-100">✓✓</span>
                        ) : (
                          <span className="text-xs text-primary-100">✓</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Chưa có tin nhắn nào</p>
              <p className="text-sm text-gray-400">
                Hãy gửi tin nhắn đầu tiên!
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              rows="1"
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              style={{ maxHeight: "120px" }}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || connectionStatus !== "connected"}
            className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={
              connectionStatus !== "connected"
                ? "Đang kết nối..."
                : "Gửi tin nhắn"
            }
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Connection Status */}
        {connectionStatus !== "connected" && (
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              {connectionStatus === "connecting"
                ? "Đang kết nối với chat server..."
                : "Không thể kết nối với chat server"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
