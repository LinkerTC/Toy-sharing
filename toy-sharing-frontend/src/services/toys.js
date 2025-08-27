// services/toys.js
import api, { apiHelpers } from "./api";

export const toysService = {
  getToys: async (params = {}) => {
    try {
      const query = apiHelpers.buildQuery(params);
      const url = query ? `/toys?${query}` : "/toys";
      const { data } = await api.get(url);
      return data.data;
    } catch (error) {
      apiHelpers.handleError(error, "Không thể tải danh sách đồ chơi");
    }
  },

  getToy: async (id) => {
    try {
      const { data } = await api.get(`/toys/${id}`);
      return data.data.toy;
    } catch (error) {
      apiHelpers.handleError(error, "Không thể tải thông tin đồ chơi");
    }
  },

  // NEW: Lấy danh sách categories (public)
  getCategories: async () => {
    try {
      const { data } = await api.get("/toys/categories");
      // Trả về mảng categories hoặc mảng rỗng
      return data?.data?.categories || [];
    } catch (error) {
      apiHelpers.handleError(error, "Không thể tải danh mục");
      return [];
    }
  },

  createToy: async (toyData) => {
    try {
      // toyData cần có: name, description, category(ObjectId), ageGroup, condition, pickupAddress, images[], price
      const { data } = await api.post("/toys", toyData);
      return data.data.toy;
    } catch (error) {
      apiHelpers.handleError(error, "Không thể tạo đồ chơi mới");
    }
  },

  // Cập nhật toy
  updateToy: async (id, toyData) => {
    try {
      const { data } = await api.put(`/toys/${id}`, toyData);
      return data.data.toy;
    } catch (error) {
      apiHelpers.handleError(error, "Không thể cập nhật đồ chơi");
    }
  },

  // Xóa toy
  deleteToy: async (id) => {
    try {
      await api.delete(`/toys/${id}`);
      return true;
    } catch (error) {
      apiHelpers.handleError(error, "Không thể xóa đồ chơi");
    }
  },

  // Lấy toys của user hiện tại
  getMyToys: async (params = {}) => {
    try {
      const query = apiHelpers.buildQuery(params); // hỗ trợ priceMin, priceMax
      const url = query ? `/toys/my-toys?${query}` : "/toys/my-toys";
      const { data } = await api.get(url);
      return data.data;
    } catch (error) {
      apiHelpers.handleError(error, "Không thể tải đồ chơi của bạn");
    }
  },

  // Search toys
  searchToys: async (searchTerm, filters = {}) => {
    try {
      const params = { search: searchTerm, ...filters };
      return await toysService.getToys(params);
    } catch (error) {
      apiHelpers.handleError(error, "Không thể tìm kiếm đồ chơi");
    }
  },
};
