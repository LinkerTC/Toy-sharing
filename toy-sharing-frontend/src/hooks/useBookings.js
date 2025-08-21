import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '@/services/api'
import toast from 'react-hot-toast'

// Booking service functions
const bookingsService = {
  getBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const url = query ? `/bookings?${query}` : '/bookings'
    const response = await api.get(url)
    return response.data.data
  },

  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data.data.booking
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData)
    return response.data.data.booking
  },

  updateBookingStatus: async ({ id, status, lenderResponse }) => {
    const response = await api.put(`/bookings/${id}/status`, {
      status,
      lenderResponse
    })
    return response.data.data.booking
  }
}

// Query keys
export const BOOKINGS_QUERY_KEYS = {
  all: ['bookings'],
  lists: () => [...BOOKINGS_QUERY_KEYS.all, 'list'],
  list: (filters) => [...BOOKINGS_QUERY_KEYS.lists(), filters],
  details: () => [...BOOKINGS_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...BOOKINGS_QUERY_KEYS.details(), id],
}

// Hook để lấy danh sách bookings
export const useBookings = (params = {}, options = {}) => {
  return useQuery(
    BOOKINGS_QUERY_KEYS.list(params),
    () => bookingsService.getBookings(params),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      keepPreviousData: true,
      ...options
    }
  )
}

// Hook để lấy chi tiết booking
export const useBooking = (id, options = {}) => {
  return useQuery(
    BOOKINGS_QUERY_KEYS.detail(id),
    () => bookingsService.getBooking(id),
    {
      enabled: !!id,
      staleTime: 1 * 60 * 1000, // 1 minute
      ...options
    }
  )
}

// Hook để tạo booking mới
export const useCreateBooking = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation(
    (bookingData) => bookingsService.createBooking(bookingData),
    {
      onSuccess: (newBooking) => {
        // Invalidate bookings list
        queryClient.invalidateQueries(BOOKINGS_QUERY_KEYS.lists())

        toast.success('Gửi yêu cầu mượn thành công! 📅', {
          icon: '🎉',
          duration: 4000
        })

        options.onSuccess?.(newBooking)
      },
      onError: (error) => {
        console.error('Create booking error:', error)
        options.onError?.(error)
      }
    }
  )
}

// Hook để cập nhật status booking
export const useUpdateBookingStatus = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation(
    (updateData) => bookingsService.updateBookingStatus(updateData),
    {
      onSuccess: (updatedBooking) => {
        // Update cache
        queryClient.invalidateQueries(BOOKINGS_QUERY_KEYS.lists())
        queryClient.setQueryData(
          BOOKINGS_QUERY_KEYS.detail(updatedBooking._id),
          updatedBooking
        )

        const statusMessages = {
          confirmed: 'Xác nhận booking thành công! ✅',
          completed: 'Hoàn thành booking! 🎊',
          cancelled: 'Đã hủy booking! ❌'
        }

        toast.success(statusMessages[updatedBooking.status] || 'Cập nhật thành công!', {
          icon: updatedBooking.status === 'completed' ? '🏆' : '📅'
        })

        options.onSuccess?.(updatedBooking)
      },
      onError: (error) => {
        console.error('Update booking status error:', error)
        options.onError?.(error)
      }
    }
  )
}