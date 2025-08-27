import api, { apiHelpers } from "./api";

export const favoriteService = {
  addFavorite: async (toyId) => {
    try {
      const response = await api.post(`/favorites/${toyId}`);
      return response.data.data;
    } catch (error) {
      apiHelpers.handleError(error, "Không thể thêm vào danh sách yêu thích");
    }
  },

  removeFavorite: async (toyId) => {
    try {
      await api.delete(`/favorites/${toyId}`);
      return true;
    } catch (error) {
      apiHelpers.handleError(error, "Không thể xóa khỏi danh sách yêu thích");
    }
  },

  getFavorites: async () => {
    try {
      const response = await api.get("/favorites");
      // API trả về mảng ở root
      return response.data;
    } catch (error) {
      apiHelpers.handleError(error, "Không thể tải danh sách yêu thích");
    }
  },
};
