import axios from 'axios'
import toast from 'react-hot-toast'

// Base URL từ environment variable
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Tạo axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Thêm auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error

    if (response) {
      const { status, data } = response

      switch (status) {
        case 401:
          // Unauthorized - Clear token và redirect to login
          localStorage.removeItem('token')
          if (window.location.pathname !== '/login') {
            toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!', {
              icon: '🔐'
            })
            window.location.href = '/login'
          }
          break

        case 403:
          toast.error('Bạn không có quyền thực hiện hành động này!', {
            icon: '🚫'
          })
          break

        case 404:
          toast.error('Không tìm thấy thông tin yêu cầu!', {
            icon: '🔍'
          })
          break

        case 429:
          toast.error('Quá nhiều yêu cầu! Vui lòng thử lại sau.', {
            icon: '⏰'
          })
          break

        case 500:
        case 502:
        case 503:
        case 504:
          toast.error('Lỗi server! Vui lòng thử lại sau.', {
            icon: '🔧'
          })
          break

        default:
          if (data?.error?.message) {
            toast.error(data.error.message, {
              icon: '❌'
            })
          } else {
            toast.error('Có lỗi xảy ra! Vui lòng thử lại.', {
              icon: '⚠️'
            })
          }
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Kết nối quá chậm! Vui lòng kiểm tra mạng.', {
        icon: '🌐'
      })
    } else {
      toast.error('Không thể kết nối đến server!', {
        icon: '📡'
      })
    }

    return Promise.reject(error)
  }
)

// Helper methods
export const apiHelpers = {
  // Standardized error handling
  handleError: (error, customMessage) => {
    console.error('API Error:', error)
    if (customMessage) {
      toast.error(customMessage, { icon: '❌' })
    }
    throw error
  },

  // Format response data
  formatResponse: (response) => {
    if (response?.data) {
      return response.data
    }
    return response
  },

  // Build query string
  buildQuery: (params) => {
    const query = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key])
      }
    })
    return query.toString()
  }
}

export default api