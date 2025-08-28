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

  updateBookingStatus: async ({ id, status}) => {
    const response = await api.put(`/bookings/${id}/status`, {
      status
    })
    return response.data.data.booking
  },

  returnToy: async (id) => {
    const response = await api.put(`/bookings/${id}/return`)
    return response.data.data.booking
  },

  checkExpiredBookings: async () => {
    const response = await api.post('/bookings/check-expired')
    return response.data.data
  },

  rateBooking: async ({ id, score, comment }) => {
    const response = await api.put(`/bookings/${id}/rate`, {
      score,
      comment
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

// Hook để trả đồ chơi
export const useReturnToy = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation(
    (bookingId) => bookingsService.returnToy(bookingId),
    {
      onSuccess: (returnedBooking) => {
        // Update cache
        queryClient.invalidateQueries(BOOKINGS_QUERY_KEYS.lists())
        queryClient.setQueryData(
          BOOKINGS_QUERY_KEYS.detail(returnedBooking._id),
          returnedBooking
        )

        toast.success('Trả đồ chơi thành công! 🎉', {
          icon: '✅',
          duration: 4000
        })

        options.onSuccess?.(returnedBooking)
      },
      onError: (error) => {
        console.error('Return toy error:', error)
        const errorMessage = error.response?.data?.error?.message || 'Không thể trả đồ chơi. Vui lòng thử lại!'
        toast.error(errorMessage, {
          icon: '❌',
          duration: 4000
        })
        options.onError?.(error)
      }
    }
  )
}

// Hook để kiểm tra booking hết hạn
export const useCheckExpiredBookings = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation(
    () => bookingsService.checkExpiredBookings(),
    {
      onSuccess: (data) => {
        // Update cache
        queryClient.invalidateQueries(BOOKINGS_QUERY_KEYS.lists())

        if (data.autoReturnedCount > 0) {
          toast.success(`Đã tự động trả ${data.autoReturnedCount} đồ chơi hết hạn! 🔄`, {
            icon: '⏰',
            duration: 5000
          })
        } else {
          toast.success('Không có đồ chơi nào hết hạn! ✅', {
            icon: '👍',
            duration: 3000
          })
        }

        options.onSuccess?.(data)
      },
      onError: (error) => {
        console.error('Check expired bookings error:', error)
        toast.error('Không thể kiểm tra đồ chơi hết hạn. Vui lòng thử lại!', {
          icon: '❌',
          duration: 4000
        })
        options.onError?.(error)
      }
    }
  )
}

// Hook để đánh giá booking
export const useRateBooking = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation(
    (ratingData) => bookingsService.rateBooking(ratingData),
    {
      onSuccess: (ratedBooking) => {
        // Update cache
        queryClient.invalidateQueries(BOOKINGS_QUERY_KEYS.lists())
        queryClient.setQueryData(
          BOOKINGS_QUERY_KEYS.detail(ratedBooking._id),
          ratedBooking
        )

        toast.success('Đánh giá thành công! 🌟', {
          icon: '⭐',
          duration: 4000
        })

        options.onSuccess?.(ratedBooking)
      },
      onError: (error) => {
        console.error('Rate booking error:', error)
        const errorMessage = error.response?.data?.error?.message || 'Không thể đánh giá. Vui lòng thử lại!'
        toast.error(errorMessage, {
          icon: '❌',
          duration: 4000
        })
        options.onError?.(error)
      }
    }
  )
}