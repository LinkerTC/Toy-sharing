import { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '@/services/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext()

// Auth state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

// Auth actions
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        isLoading: false
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user on app start
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const user = await authService.getCurrentUser()
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        })
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: null })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      dispatch({ type: 'AUTH_ERROR', payload: error.message })
    }
  }


  const login = async (email, password) => {
    try {
      dispatch({ type: 'AUTH_START' })

      const response = await authService.login(email, password)
      const { user, token } = response.data

      localStorage.setItem('token', token)

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      })

      toast.success(`Xin chào ${user.profile.firstName}! 🎉`, {
        icon: '👋',
        duration: 3000
      })

      return { success: true, user }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Đăng nhập thất bại'
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage })

      toast.error(errorMessage, {
        icon: '❌'
      })

      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' })

      const response = await authService.register(userData)
      const { user, token } = response.data

      localStorage.setItem('token', token)

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      })

      toast.success(`Chào mừng ${user.profile.firstName}! 🎊`, {
        icon: '🎉',
        duration: 4000
      })

      return { success: true, user }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Đăng ký thất bại'
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage })

      toast.error(errorMessage, {
        icon: '❌'
      })

      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'AUTH_LOGOUT' })
    toast.success('Đã đăng xuất thành công! 👋', {
      icon: '✅'
    })
  }

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
    checkAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}