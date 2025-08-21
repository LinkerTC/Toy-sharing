import api, { apiHelpers } from './api'

export const toysService = {
  // Lấy danh sách tất cả toys (public)
  getToys: async (params = {}) => {
    try {
      const query = apiHelpers.buildQuery(params)
      const url = query ? `/toys?${query}` : '/toys'
      const response = await api.get(url)
      return response.data.data
    } catch (error) {
      apiHelpers.handleError(error, 'Không thể tải danh sách đồ chơi')
    }
  },

  // Lấy chi tiết toy
  getToy: async (id) => {
    try {
      const response = await api.get(`/toys/${id}`)
      return response.data.data.toy
    } catch (error) {
      apiHelpers.handleError(error, 'Không thể tải thông tin đồ chơi')
    }
  },

  // Tạo toy mới
  createToy: async (toyData) => {
    try {
      const response = await api.post('/toys', toyData)
      return response.data.data.toy
    } catch (error) {
      apiHelpers.handleError(error, 'Không thể tạo đồ chơi mới')
    }
  },

  // Cập nhật toy
  updateToy: async (id, toyData) => {
    try {
      const response = await api.put(`/toys/${id}`, toyData)
      return response.data.data.toy
    } catch (error) {
      apiHelpers.handleError(error, 'Không thể cập nhật đồ chơi')
    }
  },

  // Xóa toy
  deleteToy: async (id) => {
    try {
      await api.delete(`/toys/${id}`)
      return true
    } catch (error) {
      apiHelpers.handleError(error, 'Không thể xóa đồ chơi')
    }
  },

  // Lấy toys của user hiện tại
  getMyToys: async (params = {}) => {
    try {
      const query = apiHelpers.buildQuery(params)
      const url = query ? `/toys/my-toys?${query}` : '/toys/my-toys'
      const response = await api.get(url)
      return response.data.data
    } catch (error) {
      apiHelpers.handleError(error, 'Không thể tải đồ chơi của bạn')
    }
  },

  // Search toys
  searchToys: async (searchTerm, filters = {}) => {
    try {
      const params = {
        search: searchTerm,
        ...filters
      }
      return await toysService.getToys(params)
    } catch (error) {
      apiHelpers.handleError(error, 'Không thể tìm kiếm đồ chơi')
    }
  }
}