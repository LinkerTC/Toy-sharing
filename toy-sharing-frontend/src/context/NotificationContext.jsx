import { createContext, useContext, useReducer } from 'react'
import toast from 'react-hot-toast'

const NotificationContext = createContext()

const initialState = {
  notifications: [],
  unreadCount: 0
}

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      }
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif => 
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif => ({ ...notif, read: true })),
        unreadCount: 0
      }
    case 'REMOVE_NOTIFICATION':
      const notification = state.notifications.find(n => n.id === action.payload)
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
        unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount
      }
    case 'CLEAR_ALL':
      return initialState
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  const addNotification = (notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date(),
      read: false
    }

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification })

    // Show toast notification
    const { type, title, message } = notification
    const toastMessage = title ? `${title}: ${message}` : message

    switch (type) {
      case 'success':
        toast.success(toastMessage, { icon: '🎉' })
        break
      case 'error':
        toast.error(toastMessage, { icon: '❌' })
        break
      case 'warning':
        toast(toastMessage, { icon: '⚠️' })
        break
      case 'info':
        toast(toastMessage, { icon: 'ℹ️' })
        break
      case 'booking':
        toast.success(toastMessage, { icon: '📅' })
        break
      case 'toy':
        toast.success(toastMessage, { icon: '🧸' })
        break
      default:
        toast(toastMessage)
    }

    return id
  }

  const markAsRead = (id) => {
    dispatch({ type: 'MARK_AS_READ', payload: id })
  }

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' })
  }

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' })
  }

  // Helper methods for common notification types
  const notifySuccess = (title, message) => {
    return addNotification({ type: 'success', title, message })
  }

  const notifyError = (title, message) => {
    return addNotification({ type: 'error', title, message })
  }

  const notifyBooking = (title, message) => {
    return addNotification({ type: 'booking', title, message })
  }

  const notifyToy = (title, message) => {
    return addNotification({ type: 'toy', title, message })
  }

  const value = {
    ...state,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    notifySuccess,
    notifyError,
    notifyBooking,
    notifyToy
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}