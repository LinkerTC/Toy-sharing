import api from './api'

export const authService = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data.data.user
    } catch (error) {
      throw error
    }
  },

  // Đăng xuất (client-side only)
  logout: () => {
    localStorage.removeItem('token')
  },

  // Kiểm tra token có hợp lệ không
  validateToken: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data.success
    } catch (error) {
      return false
    }
  }
}