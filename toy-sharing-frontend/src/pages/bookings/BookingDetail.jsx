import { useParams, Link } from 'react-router-dom'
import { useBooking, useUpdateBookingStatus } from '@/hooks/useBookings'
import toast from 'react-hot-toast'

const BookingDetail = () => {
  const { id } = useParams()
  const { data: booking, isLoading: loading, error } = useBooking(id)
  const updateBookingStatus = useUpdateBookingStatus()

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt mượn này?')) {
      try {
        await updateBookingStatus.mutateAsync({
          id: booking._id || booking.id,
          status: 'cancelled'
        })
      } catch (error) {
        toast.error('Không thể hủy đặt mượn. Vui lòng thử lại!')
      }
    }
  }

  // Handle toy return
  const handleReturnToy = async () => {
    if (window.confirm('Bạn có chắc chắn muốn trả đồ chơi này?')) {
      try {
        await updateBookingStatus.mutateAsync({
          id: booking._id || booking.id,
          status: 'completed'
        })
      } catch (error) {
        toast.error('Không thể trả đồ chơi. Vui lòng thử lại!')
      }
    }
  }

  // Map backend status to frontend display status
  const mapStatus = (status) => {
    const statusMap = {
      'requested': 'pending',
      'confirmed': 'active',
      'completed': 'completed',
      'cancelled': 'cancelled'
    }
    return statusMap[status] || status
  }

  // Generate timeline based on booking data
  const generateTimeline = (booking) => {
    if (!booking) return []
    
    const timeline = [
      { 
        date: booking.createdAt, 
        event: 'Yêu cầu mượn đã được gửi', 
        status: 'completed' 
      }
    ]

    if (booking.status === 'confirmed' || booking.status === 'completed') {
      timeline.push({
        date: booking.updatedAt || booking.createdAt,
        event: 'Chủ sở hữu đã xác nhận',
        status: 'completed'
      })
      
      timeline.push({
        date: booking.startDate,
        event: booking.status === 'completed' ? 'Đã nhận đồ chơi' : 'Dự kiến nhận đồ chơi',
        status: new Date(booking.startDate) <= new Date() ? 'completed' : 'pending'
      })
    }

    if (booking.status === 'completed') {
      timeline.push({
        date: booking.returnedAt || booking.endDate,
        event: 'Đã trả về đồ chơi',
        status: 'completed'
      })
    } else if (booking.status === 'confirmed') {
      timeline.push({
        date: booking.endDate,
        event: 'Dự kiến trả về',
        status: 'pending'
      })
    }

    if (booking.status === 'cancelled') {
      timeline.push({
        date: booking.updatedAt || booking.createdAt,
        event: 'Đã hủy yêu cầu',
        status: 'completed'
      })
    }

    return timeline
  }

  // Calculate booking duration
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get category display info
  const getCategoryInfo = (category) => {
    const categoryMap = {
      'educational': { label: 'Giáo dục', icon: '📚', color: 'bg-blue-100 text-blue-600' },
      'electronic': { label: 'Điện tử', icon: '🤖', color: 'bg-purple-100 text-purple-600' },
      'outdoor': { label: 'Ngoài trời', icon: '🏃', color: 'bg-green-100 text-green-600' },
      'creative': { label: 'Sáng tạo', icon: '🎨', color: 'bg-pink-100 text-pink-600' },
      'puzzle': { label: 'Trò chơi', icon: '🧩', color: 'bg-orange-100 text-orange-600' },
      'doll': { label: 'Búp bê', icon: '👶', color: 'bg-rose-100 text-rose-600' }
    }
    return categoryMap[category] || { label: 'Khác', icon: '🧸', color: 'bg-gray-100 text-gray-600' }
  }

  // Get condition display info
  const getConditionInfo = (condition) => {
    const conditionMap = {
      'new': { label: 'Mới', color: 'bg-green-100 text-green-600' },
      'like-new': { label: 'Như mới', color: 'bg-blue-100 text-blue-600' },
      'good': { label: 'Tốt', color: 'bg-yellow-100 text-yellow-600' },
      'fair': { label: 'Khá', color: 'bg-orange-100 text-orange-600' }
    }
    return conditionMap[condition] || { label: 'Không xác định', color: 'bg-gray-100 text-gray-600' }
  }

  const getStatusBadge = (status) => {
    const mappedStatus = mapStatus(status)
    const badges = {
      active: { label: 'Đang mượn', color: 'bg-green-100 text-green-600', icon: '🟢' },
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-600', icon: '🟡' },
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
            <p className="text-gray-600 text-lg">Đang tải chi tiết đặt mượn...</p>
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
              Không thể tải chi tiết đặt mượn
            </h3>
            <p className="text-gray-600 mb-6">
              Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
            </p>
            <Link 
              to="/bookings" 
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
            >
              ← Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy thông tin</h2>
            <Link to="/bookings" className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors">
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/bookings" className="text-pink-500 hover:text-pink-600">Lịch sử mượn</Link>
            <span>›</span>
            <span className="text-gray-700 font-medium">Chi tiết #{booking._id || booking.id}</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chi tiết đặt mượn
              </h1>
              <p className="text-gray-600">Mã đặt mượn: #{booking._id || booking.id}</p>
            </div>
            {getStatusBadge(booking.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Toy Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🧸 Thông tin đồ chơi</h2>

              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {booking.toy.images && booking.toy.images.length > 0 ? (
                    <img 
                      src={booking.toy.images[0]} 
                      alt={booking.toy.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">{getCategoryInfo(booking.toy.category).icon}</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link to={`/toys/${booking.toy._id || booking.toy.id}`} className="hover:text-pink-500 transition-colors">
                      {booking.toy.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{booking.toy.description}</p>

                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryInfo(booking.toy.category).color}`}>
                      {getCategoryInfo(booking.toy.category).icon} {getCategoryInfo(booking.toy.category).label}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionInfo(booking.toy.condition).color}`}>
                      {getConditionInfo(booking.toy.condition).label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">📅 Tiến trình</h2>

              <div className="space-y-4">
                {generateTimeline(booking).map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {item.status === 'completed' ? (
                        <span className="text-green-600 text-sm">✓</span>
                      ) : (
                        <span className="text-gray-400 text-sm">○</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${
                          item.status === 'completed' ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {item.event}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            {(booking.message || booking.lenderResponse) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">💬 Tin nhắn</h2>
                
                {booking.message && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Lời nhắn từ bạn:</div>
                    <p className="text-gray-700 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">{booking.message}</p>
                  </div>
                )}
                
                {booking.lenderResponse && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Phản hồi từ chủ sở hữu:</div>
                    <p className="text-gray-700 bg-green-50 rounded-lg p-4 border-l-4 border-green-400">{booking.lenderResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Booking Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Chi tiết</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày nhận:</span>
                  <span className="font-medium">{new Date(booking.startDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày trả:</span>
                  <span className="font-medium">{new Date(booking.endDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">{calculateDuration(booking.startDate, booking.endDate)} ngày</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-gray-600 mb-1">Địa điểm:</div>
                  <div className="font-medium">{booking.toy.location || 'Không xác định'}</div>
                </div>
                {booking.paymentInfo && (
                  <div className="pt-2 border-t">
                    <div className="text-gray-600 mb-1">Thanh toán:</div>
                    <div className="font-medium">{booking.paymentInfo.amount?.toLocaleString('vi-VN')} VNĐ</div>
                    <div className="text-sm text-gray-500">{booking.paymentInfo.method}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Chủ sở hữu</h3>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {booking.toy.owner?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{booking.toy.owner?.name || 'Không xác định'}</div>
                  <div className="text-sm text-gray-500">Chủ sở hữu</div>
                </div>
              </div>

              <div className="space-y-3">
                {booking.toy.owner?.phone && (
                  <a 
                    href={`tel:${booking.toy.owner.phone}`}
                    className="w-full bg-green-100 text-green-700 px-4 py-3 rounded-xl font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>📞</span>
                    <span>Gọi điện</span>
                  </a>
                )}
                {booking.toy.owner?.email && (
                  <a 
                    href={`mailto:${booking.toy.owner.email}`}
                    className="w-full bg-blue-100 text-blue-700 px-4 py-3 rounded-xl font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>📧</span>
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Hành động</h3>

              <div className="space-y-3">
                {mapStatus(booking.status) === 'active' && (
                  <button 
                    onClick={handleReturnToy}
                    disabled={updateBookingStatus.isLoading}
                    className="w-full bg-green-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    ✅ Xác nhận trả về
                  </button>
                )}

                {mapStatus(booking.status) === 'pending' && (
                  <button 
                    onClick={handleCancelBooking}
                    disabled={updateBookingStatus.isLoading}
                    className="w-full bg-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    ❌ Hủy yêu cầu
                  </button>
                )}

                {mapStatus(booking.status) === 'completed' && (
                  <button className="w-full bg-yellow-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors">
                    ⭐ Đánh giá trải nghiệm
                  </button>
                )}

                <Link 
                  to="/bookings"
                  className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center block"
                >
                  ← Quay lại danh sách
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetail