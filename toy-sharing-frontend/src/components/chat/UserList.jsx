import { useState, useEffect } from "react";
import { Search, MessageCircle, Users, Plus, Loader2 } from "lucide-react";
import { useUserSearch } from "../../hooks/useChat";
import { useAuth } from "../../context/AuthContext";

const UserList = ({
  onSelectUser,
  selectedUserId,
  onlineUsers = new Set(),
}) => {
  const { user: currentUser } = useAuth();
  const {
    users,
    searchQuery,
    setSearchQuery,
    loading,
    pagination,
    loadMoreUsers,
    hasMore,
  } = useUserSearch();
  const [showAllUsers, setShowAllUsers] = useState(false);

  const handleUserSelect = (user) => {
    onSelectUser(user);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
      loadMoreUsers();
    }
  };

  const filteredUsers = users.filter((user) => user.id !== currentUser?.id);

  // Kiểm tra user có online không
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  return (
    <div className="h-full bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Người dùng</h2>
            {pagination && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {pagination.totalUsers} người dùng
              </span>
            )}
            {/* Online Users Count */}
            {onlineUsers.size > 0 && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                {onlineUsers.size} online
              </span>
            )}
          </div>
          <button
            onClick={() => setShowAllUsers(!showAllUsers)}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{showAllUsers ? "Ẩn" : "Tìm"}</span>
          </button>
        </div>

        {showAllUsers && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng theo email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => {
              const isOnline = isUserOnline(user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedUserId === user.id
                      ? "bg-primary-50 border-r-2 border-primary-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-semibold">
                          {(user.name || user.username || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                      {/* Online Status Indicator */}
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {user.name || user.username}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {isOnline && (
                            <span className="text-xs text-green-600 font-medium">
                              Online
                            </span>
                          )}
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      {user.email && (
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      )}
                      {user.phone && (
                        <p className="text-xs text-gray-400 truncate">
                          📞 {user.phone}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`text-xs ${isOnline ? "text-green-600" : "text-gray-400"}`}
                        >
                          {isOnline
                            ? "🟢 Đang hoạt động"
                            : "⚫ Không hoạt động"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading indicator for pagination */}
            {loading && users.length > 0 && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                <span className="ml-2 text-sm text-gray-500">
                  Đang tải thêm...
                </span>
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore && users.length > 0 && (
              <div className="p-4 text-center">
                <span className="text-xs text-gray-400">
                  Đã hiển thị tất cả người dùng
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery
                ? "Không tìm thấy người dùng"
                : "Chưa có người dùng nào"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Thử tìm kiếm với từ khóa khác"
                : showAllUsers
                  ? "Danh sách người dùng sẽ hiển thị ở đây"
                  : 'Nhấn "Tìm" để tìm kiếm người dùng'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
