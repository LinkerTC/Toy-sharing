import { useState } from "react";
import { MessageCircle, Users, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useConversations } from "../hooks/useChat";
import UserList from "../components/chat/UserList";
import ChatBox from "../components/chat/ChatBox";

const Chat = () => {
  const { user } = useAuth();
  const { conversations, loading, onlineUsers, isConnected } =
    useConversations();
  const [activeTab, setActiveTab] = useState("conversations");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setSelectedUser(conversation.otherUser);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedConversation(null);
  };

  const getConnectionStatusIcon = () => {
    if (isConnected) {
      return <Wifi className="w-4 h-4 text-green-500" />;
    }
    return <WifiOff className="w-4 h-4 text-red-500" />;
  };

  const getConnectionStatusText = () => {
    if (isConnected) {
      return "Đã kết nối";
    }
    return "Đang kết nối...";
  };

  const getConnectionStatusColor = () => {
    if (isConnected) {
      return "text-green-600";
    }
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">Tin nhắn</h1>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              {getConnectionStatusIcon()}
              <span
                className={`text-sm font-medium ${getConnectionStatusColor()}`}
              >
                {getConnectionStatusText()}
              </span>
              {!isConnected && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-red-50 border border-red-200 rounded-full">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600">Lỗi kết nối</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600">
            Trò chuyện với các thành viên khác về việc chia sẻ đồ chơi
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg border border-gray-200 h-[600px] overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("conversations")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "conversations"
                      ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Cuộc trò chuyện</span>
                    {conversations.length > 0 && (
                      <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                        {conversations.length}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "users"
                      ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Người dùng</span>
                    {onlineUsers.size > 0 && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {onlineUsers.size} online
                      </span>
                    )}
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 h-full overflow-hidden">
                {activeTab === "conversations" ? (
                  <div className="h-full overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      </div>
                    ) : conversations.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {conversations.map((conversation) => {
                          const isUserOnline = onlineUsers.has(
                            conversation.otherUser.id
                          );
                          return (
                            <div
                              key={conversation.id}
                              onClick={() =>
                                handleConversationSelect(conversation)
                              }
                              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedConversation?.id === conversation.id
                                  ? "bg-primary-50 border-r-2 border-primary-500"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-semibold">
                                    {(
                                      conversation.otherUser?.fullName ||
                                      conversation.otherUser?.name ||
                                      "?"
                                    )
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                  {/* Online Status Indicator */}
                                  {isUserOnline && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                      {conversation.otherUser?.fullName ||
                                        conversation.otherUser?.name}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                      {isUserOnline && (
                                        <span className="text-xs text-green-600 font-medium">
                                          Online
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-500">
                                        {conversation.lastMessage?.timestamp &&
                                          new Date(
                                            conversation.lastMessage.timestamp
                                          ).toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-500 truncate">
                                    {conversation.lastMessage?.message ||
                                      "Chưa có tin nhắn"}
                                  </p>
                                </div>
                                {conversation.unreadCount > 0 && (
                                  <div className="flex-shrink-0">
                                    <div className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                                      {conversation.unreadCount}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Chưa có cuộc trò chuyện nào
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Bắt đầu trò chuyện bằng cách chọn người dùng từ tab
                          "Người dùng"
                        </p>
                        <button
                          onClick={() => setActiveTab("users")}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Tìm người dùng →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <UserList
                    onSelectUser={handleUserSelect}
                    selectedUserId={selectedUser?.id}
                    onlineUsers={onlineUsers}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg border border-gray-200 h-[600px] flex flex-col">
              {selectedUser ? (
                <ChatBox
                  userId={user?.id}
                  receiverId={selectedUser.id}
                  receiverName={selectedUser.fullName || selectedUser.name}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      Chọn cuộc trò chuyện
                    </h3>
                    <p className="text-gray-500">
                      Chọn một cuộc trò chuyện từ danh sách bên trái hoặc tìm
                      người dùng để bắt đầu trò chuyện
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
