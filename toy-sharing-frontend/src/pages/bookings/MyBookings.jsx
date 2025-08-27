import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBookings, useUpdateBookingStatus, useReturnToy, useCheckExpiredBookings } from '@/hooks/useBookings'
import RatingModal from '@/components/modals/RatingModal'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [ratingModal, setRatingModal] = useState({ isOpen: false, booking: null })
  
  // Fetch real bookings data
  const { data: bookingsData, isLoading: loading, error } = useBookings()
  
  // Debug logging
  console.log('Bookings API response:', bookingsData)
  console.log('Loading state:', loading)
  console.log('Error state:', error)
  
  // Ensure bookings is always an array
  const bookings = Array.isArray(bookingsData) ? bookingsData : 
                   (bookingsData?.bookings && Array.isArray(bookingsData.bookings)) ? bookingsData.bookings : []
  const updateBookingStatus = useUpdateBookingStatus()
  const returnToy = useReturnToy()
  const checkExpiredBookings = useCheckExpiredBookings()

  // Auto-check for expired bookings when component mounts
  useEffect(() => {
    if (bookings.length > 0) {
      checkExpiredBookings.mutate()
    }
  }, [bookings.length])

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt mượn này?')) {
      try {
        await updateBookingStatus.mutateAsync({
          id: bookingId,
          status: 'cancelled'
        })
      } catch (error) {
        toast.error('Không thể hủy đặt mượn. Vui lòng thử lại!')
      }
    }
  }

  // Handle toy return
  const handleReturnToy = async (bookingId) => {
    if (window.confirm('Bạn có chắc chắn muốn trả đồ chơi này?')) {
      try {
        await returnToy.mutateAsync(bookingId)
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  }

  // Check if a booking is overdue
  const isBookingOverdue = (booking) => {
    if (mapStatus(booking.status) !== 'active') return false
    const now = new Date()
    const endDate = new Date(booking.endDate)
    return endDate < now
  }

  // Handle manual expired check
  const handleCheckExpired = () => {
    checkExpiredBookings.mutate()
  }

  // Handle rating modal
  const handleOpenRating = (booking) => {
    setRatingModal({ isOpen: true, booking })
  }

  const handleCloseRating = () => {
    setRatingModal({ isOpen: false, booking: null })
  }

  // Map backend status to frontend display status
  const mapStatus = (status) => {
    const statusMap = {
      'confirmed': 'active',
      'completed': 'completed',
      'cancelled': 'cancelled'
    }
    return statusMap[status] || status
  }

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => mapStatus(b.status) === 'active').length,
    completed: bookings.filter(b => mapStatus(b.status) === 'completed').length,
    cancelled: bookings.filter(b => mapStatus(b.status) === 'cancelled').length
  }

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true
    return mapStatus(booking.status) === activeTab
  })

  const getStatusBadge = (status) => {
    const mappedStatus = mapStatus(status)
    const badges = {
      active: { label: 'Đang mượn', color: 'bg-green-100 text-green-600', icon: '🟢' },
      completed: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-600', icon: '✅' },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-600', icon: '❌' }
    }
    const badge = badges[mappedStatus] || { label: 'Không xác định', color: 'bg-gray-100 text-gray-600', icon: '❓' }
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.icon} {badge.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Đang tải danh sách đặt mượn...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Không thể tải danh sách đặt mượn
            </h3>
            <p className="text-gray-600 mb-6">
              Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
            >
              🔄 Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📅 Lịch sử mượn đồ chơi
              </h1>
              <p className="text-gray-600">
                Theo dõi và quản lý các lần mượn đồ chơi của bạn
              </p>
            </div>
            <button
              onClick={handleCheckExpired}
              disabled={checkExpiredBookings.isLoading}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-medium hover:bg-orange-200 transition-colors disabled:opacity-50"
            >
              {checkExpiredBookings.isLoading ? '⏳ Đang kiểm tra...' : '⏰ Kiểm tra hết hạn'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-gray-600">Tổng số</div>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                <div className="text-gray-600">Đang mượn</div>
              </div>
              <div className="text-3xl">🟢</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                <div className="text-gray-600">Hoàn thành</div>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.cancelled}</div>
                <div className="text-gray-600">Đã hủy</div>
              </div>
              <div className="text-3xl">❌</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Tất cả', icon: '📋' },
              { key: 'active', label: 'Đang mượn', icon: '🟢' },
              { key: 'completed', label: 'Hoàn thành', icon: '✅' },
              { key: 'cancelled', label: 'Đã hủy', icon: '❌' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-lg">
          {filteredBookings.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">

                    {/* Toy Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🧸</span>
                    </div>

                    {/* Booking Info */}
                    <div className="flex-1">

                      {/* Status & Dates */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(booking.status)}
                          {isBookingOverdue(booking) && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                              ⚠️ Quá hạn
                            </span>
                          )}
                        </div>
                        <div className={`text-sm ${isBookingOverdue(booking) ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                          {new Date(booking.startDate).toLocaleDateString('vi-VN')} - {new Date(booking.endDate).toLocaleDateString('vi-VN')}
                        </div>
                      </div>

                      {/* Toy Name */}
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        <Link to={`/toys/${booking.toy._id || booking.toy.id}`} className="hover:text-pink-500 transition-colors">
                          {booking.toy.name}
                        </Link>
                      </h3>

                      {/* Owner & Location */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {booking.toy.owner?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <span>Chủ sở hữu: {booking.toy.owner?.name || 'Không xác định'}</span>
                        </div>
                        <span>📍 {booking.toy.location || 'Không xác định'}</span>
                      </div>

                      {/* Rating for completed bookings */}
                      {mapStatus(booking.status) === 'completed' && booking.rating && booking.rating.score && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-gray-600">Đánh giá của bạn:</span>
                          <div className="flex space-x-1">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} className={`text-lg ${star <= booking.rating.score ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({booking.rating.score}/5)</span>
                        </div>
                      )}
                      
                      {/* Rating comment */}
                      {mapStatus(booking.status) === 'completed' && booking.rating && booking.rating.comment && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600 italic">
                            "{booking.rating.comment}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link 
                        to={`/bookings/${booking._id || booking.id}`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors text-center"
                      >
                        👀 Chi tiết
                      </Link>


                      {mapStatus(booking.status) === 'active' && (
                        <button 
                          onClick={() => handleReturnToy(booking._id || booking.id)}
                          disabled={returnToy.isLoading}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          {returnToy.isLoading ? '⏳ Đang xử lý...' : '✅ Trả về'}
                        </button>
                      )}

                      {mapStatus(booking.status) === 'completed' && (!booking.rating || !booking.rating.score) && (
                        <button 
                          onClick={() => handleOpenRating(booking)}
                          className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
                        >
                          ⭐ Đánh giá
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {activeTab === 'all' ? 'Chưa có lịch sử mượn' : `Không có ${
                  activeTab === 'active' ? 'đồ chơi đang mượn' :
                  activeTab === 'completed' ? 'giao dịch hoàn thành' : 'giao dịch đã hủy'
                }`}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'all' 
                  ? 'Hãy bắt đầu khám phá và mượn những đồ chơi thú vị!'
                  : 'Thử chuyển sang tab khác để xem các giao dịch.'
                }
              </p>
              {activeTab === 'all' && (
                <Link to="/toys" className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors">
                  🧸 Khám phá đồ chơi
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Rating Modal */}
        <RatingModal
          isOpen={ratingModal.isOpen}
          onClose={handleCloseRating}
          booking={ratingModal.booking}
        />
      </div>
    </div>
  )
}

export default MyBookings