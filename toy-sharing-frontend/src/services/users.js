import api from "./api";

// Lấy danh sách tất cả người dùng
export const getAllUsers = async (params = {}) => {
  try {
    const { page = 1, limit = 20, search = "", exclude = [] } = params;

    const queryParams = {
      page,
      limit,
      search,
      exclude: exclude.join(","), // Convert array to comma-separated string
    };

    const response = await api.get("/users", {
      params: queryParams,
    });

    return {
      users: response.data.data || response.data.users || [],
      total: response.data.total || 0,
      currentPage: response.data.currentPage || page,
      totalPages: response.data.totalPages || 1,
      hasMore: response.data.hasMore || false,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    // Return empty result instead of throwing for better UX
    return {
      users: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
      hasMore: false,
    };
  }
};

// Lấy thông tin người dùng theo ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Tìm kiếm người dùng
export const searchUsers = async (query, params = {}) => {
  try {
    const { page = 1, limit = 20, exclude = [] } = params;

    if (!query || query.trim().length < 2) {
      // If query is too short, return all users
      return await getAllUsers({ page, limit, exclude });
    }

    const queryParams = {
      q: query.trim(),
      page,
      limit,
      exclude: exclude.join(","),
    };

    const response = await api.get("/users/search", {
      params: queryParams,
    });

    return {
      users: response.data.data || response.data.users || [],
      total: response.data.total || 0,
      currentPage: response.data.currentPage || page,
      totalPages: response.data.totalPages || 1,
      hasMore: response.data.hasMore || false,
    };
  } catch (error) {
    console.error("Error searching users:", error);
    // Fallback to getAllUsers if search fails
    return await getAllUsers({ page: 1, limit: 20, exclude });
  }
};

// Lấy danh sách người dùng đã từng chat
export const getChatUsers = async () => {
  try {
    const response = await api.get("/users/chat-history");
    return {
      users: response.data.data || response.data.users || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    console.error("Error fetching chat users:", error);
    return {
      users: [],
      total: 0,
    };
  }
};

// Lấy profile của người dùng hiện tại
export const getCurrentUserProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Cập nhật trạng thái online/offline
export const updateUserStatus = async (status) => {
  try {
    const response = await api.patch("/users/status", { status });
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};
