import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const BookingDetail = () => {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBooking = async () => {
      setLoading(true)
      // Mock booking data
      const mockBooking = {
        id: id,
        toy: {
          id: 'toy1',
          name: 'Robot Transformer Optimus Prime',
          description: 'Robot biến hình cao cấp với thiết kế chi tiết...',
          category: 'electronic',
          condition: 'like-new',
          owner: { 
            id: 'owner1',
            name: 'Nguyễn Văn A', 
            avatar: 'A',
            phone: '0912345678',
            email: 'nguyenvana@email.com'
          },
          images: []
        },
        status: 'active',
        startDate: '2024-01-20',
        endDate: '2024-01-27',
        location: 'Quận 1, TP.HCM',
        pickupAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        createdAt: '2024-01-15',
        notes: 'Gặp mặt tại công viên Tao Đàn lúc 14:00',
        timeline: [
          { date: '2024-01-15', event: 'Yêu cầu mượn đã được gửi', status: 'completed' },
          { date: '2024-01-16', event: 'Chủ sở hữu đã xác nhận', status: 'completed' },
          { date: '2024-01-20', event: 'Đã nhận đồ chơi', status: 'completed' },
          { date: '2024-01-27', event: 'Dự kiến trả về', status: 'pending' }
        ]
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      setBooking(mockBooking)
      setLoading(false)
    }
    loadBooking()
  }, [id])

  const getStatusBadge = (status) => {
    const badges = {
      active: { label: 'Đang mượn', color: 'bg-green-100 text-green-600', icon: '🟢' },
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-600', icon: '🟡' },
      completed: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-600', icon: '✅' },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-600', icon: '❌' }
    }
    const badge = badges[status]
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
            <span className="text-gray-700 font-medium">Chi tiết #{booking.id}</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chi tiết đặt mượn
              </h1>
              <p className="text-gray-600">Mã đặt mượn: #{booking.id}</p>
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
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🤖</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link to={`/toys/${booking.toy.id}`} className="hover:text-pink-500 transition-colors">
                      {booking.toy.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{booking.toy.description}</p>

                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-600">
                      🤖 Điện tử
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                      Như mới
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">📅 Tiến trình</h2>

              <div className="space-y-4">
                {booking.timeline.map((item, index) => (
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

            {/* Notes */}
            {booking.notes && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 Ghi chú</h2>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{booking.notes}</p>
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
                  <span className="font-medium">7 ngày</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-gray-600 mb-1">Địa điểm:</div>
                  <div className="font-medium">{booking.pickupAddress}</div>
                </div>
              </div>
            </div>

            {/* Owner Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Chủ sở hữu</h3>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {booking.toy.owner.avatar}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{booking.toy.owner.name}</div>
                  <div className="text-sm text-gray-500">Chủ sở hữu</div>
                </div>
              </div>

              <div className="space-y-3">
                <a 
                  href={`tel:${booking.toy.owner.phone}`}
                  className="w-full bg-green-100 text-green-700 px-4 py-3 rounded-xl font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                >
                  <span>📞</span>
                  <span>Gọi điện</span>
                </a>
                <a 
                  href={`mailto:${booking.toy.owner.email}`}
                  className="w-full bg-blue-100 text-blue-700 px-4 py-3 rounded-xl font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                >
                  <span>📧</span>
                  <span>Email</span>
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Hành động</h3>

              <div className="space-y-3">
                {booking.status === 'active' && (
                  <button className="w-full bg-green-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                    ✅ Xác nhận trả về
                  </button>
                )}

                {booking.status === 'pending' && (
                  <button className="w-full bg-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
                    ❌ Hủy yêu cầu
                  </button>
                )}

                {booking.status === 'completed' && (
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