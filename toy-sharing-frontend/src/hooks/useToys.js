import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toysService } from '@/services/toys'
import toast from 'react-hot-toast'

// Query keys
export const TOYS_QUERY_KEYS = {
  all: ['toys'],
  lists: () => [...TOYS_QUERY_KEYS.all, 'list'],
  list: (filters) => [...TOYS_QUERY_KEYS.lists(), filters],
  details: () => [...TOYS_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...TOYS_QUERY_KEYS.details(), id],
  myToys: () => [...TOYS_QUERY_KEYS.all, 'my-toys'],
}

// Hook để lấy danh sách toys
export const useToys = (params = {}, options = {}) => {
  return useQuery(
    TOYS_QUERY_KEYS.list(params),
    () => toysService.getToys(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      keepPreviousData: true,
      ...options
    }
  )
}

// Hook để lấy chi tiết toy
export const useToy = (id, options = {}) => {
  return useQuery(
    TOYS_QUERY_KEYS.detail(id),
    () => toysService.getToy(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      ...options
    }
  )
}

// Hook để lấy toys của user
export const useMyToys = (params = {}, options = {}) => {
  return useQuery(
    TOYS_QUERY_KEYS.myToys(),
    () => toysService.getMyToys(params),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      ...options
    }
  )
}

// Hook để tạo toy mới
export const useCreateToy = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation(
    (toyData) => toysService.createToy(toyData),
    {
      onSuccess: (newToy) => {
        // Invalidate related queries
        queryClient.invalidateQueries(TOYS_QUERY_KEYS.lists())
        queryClient.invalidateQueries(TOYS_QUERY_KEYS.myToys())

        toast.success('Tạo đồ chơi thành công! 🧸', {
          icon: '🎉'
        })

        options.onSuccess?.(newToy)
      },
      onError: (error) => {
        console.error('Create toy error:', error)
        options.onError?.(error)
      }
    }
  )
}

// Hook để cập nhật toy
export const useUpdateToy = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ id, toyData }) => toysService.updateToy(id, toyData),
    {
      onSuccess: (updatedToy) => {
        // Update cache
        queryClient.invalidateQueries(TOYS_QUERY_KEYS.lists())
        queryClient.invalidateQueries(TOYS_QUERY_KEYS.myToys())
        queryClient.setQueryData(
          TOYS_QUERY_KEYS.detail(updatedToy._id),
          updatedToy
        )

        toast.success('Cập nhật đồ chơi thành công! ✅', {
          icon: '🔄'
        })

        options.onSuccess?.(updatedToy)
      },
      onError: (error) => {
        console.error('Update toy error:', error)
        options.onError?.(error)
      }
    }
  )
}

// Hook để xóa toy
export const useDeleteToy = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation(
    (id) => toysService.deleteToy(id),
    {
      onSuccess: (_, deletedId) => {
        // Remove from cache
        queryClient.invalidateQueries(TOYS_QUERY_KEYS.lists())
        queryClient.invalidateQueries(TOYS_QUERY_KEYS.myToys())
        queryClient.removeQueries(TOYS_QUERY_KEYS.detail(deletedId))

        toast.success('Xóa đồ chơi thành công! 🗑️', {
          icon: '✅'
        })

        options.onSuccess?.(deletedId)
      },
      onError: (error) => {
        console.error('Delete toy error:', error)
        options.onError?.(error)
      }
    }
  )
}

// Hook để search toys
export const useSearchToys = (searchTerm, filters = {}, options = {}) => {
  return useQuery(
    TOYS_QUERY_KEYS.list({ search: searchTerm, ...filters }),
    () => toysService.searchToys(searchTerm, filters),
    {
      enabled: !!searchTerm && searchTerm.length > 2,
      staleTime: 30 * 1000, // 30 seconds
      keepPreviousData: true,
      ...options
    }
  )
}