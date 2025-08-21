import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      // Mock bookings data
      const mockBookings = [
        {
          id: '1',
          toy: {
            id: 'toy1',
            name: 'Robot Transformer Optimus Prime',
            owner: { name: 'Nguyễn Văn A', avatar: 'A' },
            images: []
          },
          status: 'active',
          startDate: '2024-01-20',
          endDate: '2024-01-27',
          location: 'Quận 1, TP.HCM',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          toy: {
            id: 'toy2',
            name: 'Bộ đồ chơi xếp hình LEGO',
            owner: { name: 'Trần Thị B', avatar: 'B' },
            images: []
          },
          status: 'pending',
          startDate: '2024-02-01',
          endDate: '2024-02-08',
          location: 'Quận 3, TP.HCM',
          createdAt: '2024-01-25'
        },
        {
          id: '3',
          toy: {
            id: 'toy3',
            name: 'Búp bê Barbie công chúa',
            owner: { name: 'Lê Thị C', avatar: 'C' },
            images: []
          },
          status: 'completed',
          startDate: '2024-01-01',
          endDate: '2024-01-08',
          location: 'Quận 7, TP.HCM',
          createdAt: '2023-12-28',
          rating: 5
        }
      ]

      await new Promise(resolve => setTimeout(resolve, 1000))
      setBookings(mockBookings)
      setLoading(false)
    }
    loadBookings()
  }, [])

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'active').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length
  }

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true
    return booking.status === activeTab
  })

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
            <p className="text-gray-600 text-lg">Đang tải danh sách đặt mượn...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📅 Lịch sử mượn đồ chơi
          </h1>
          <p className="text-gray-600">
            Theo dõi và quản lý các lần mượn đồ chơi của bạn
          </p>
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

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                <div className="text-gray-600">Chờ xác nhận</div>
              </div>
              <div className="text-3xl">🟡</div>
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
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Tất cả', icon: '📋' },
              { key: 'active', label: 'Đang mượn', icon: '🟢' },
              { key: 'pending', label: 'Chờ xác nhận', icon: '🟡' },
              { key: 'completed', label: 'Hoàn thành', icon: '✅' }
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
                        {getStatusBadge(booking.status)}
                        <div className="text-sm text-gray-500">
                          {new Date(booking.startDate).toLocaleDateString('vi-VN')} - {new Date(booking.endDate).toLocaleDateString('vi-VN')}
                        </div>
                      </div>

                      {/* Toy Name */}
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        <Link to={`/toys/${booking.toy.id}`} className="hover:text-pink-500 transition-colors">
                          {booking.toy.name}
                        </Link>
                      </h3>

                      {/* Owner & Location */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {booking.toy.owner.avatar}
                          </div>
                          <span>Chủ sở hữu: {booking.toy.owner.name}</span>
                        </div>
                        <span>📍 {booking.location}</span>
                      </div>

                      {/* Rating for completed bookings */}
                      {booking.status === 'completed' && booking.rating && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-gray-600">Đánh giá của bạn:</span>
                          <div className="flex space-x-1">
                            {[1,2,3,4,5].map(star => (
                              <span key={star} className={`text-lg ${star <= booking.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link 
                        to={`/bookings/${booking.id}`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors text-center"
                      >
                        👀 Chi tiết
                      </Link>

                      {booking.status === 'pending' && (
                        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors">
                          ❌ Hủy
                        </button>
                      )}

                      {booking.status === 'active' && (
                        <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors">
                          ✅ Trả về
                        </button>
                      )}

                      {booking.status === 'completed' && !booking.rating && (
                        <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-colors">
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
                  activeTab === 'pending' ? 'yêu cầu chờ xác nhận' : 'giao dịch hoàn thành'
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
      </div>
    </div>
  )
}

export default MyBookings