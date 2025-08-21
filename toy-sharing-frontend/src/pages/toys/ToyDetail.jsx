import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const ToyDetail = () => {
  const { id } = useParams()
  const [toy, setToy] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock toy data
    const mockToy = {
      id: id,
      name: 'Robot Transformer Optimus Prime',
      description: 'Robot biến hình cao cấp với thiết kế chi tiết và chất liệu an toàn cho trẻ em. Sản phẩm có thể biến hình từ robot thành xe tải và ngược lại.',
      category: 'electronic',
      condition: 'like-new',
      ageGroup: '6-8',
      status: 'available',
      owner: {
        id: 'owner123',
        name: 'Nguyễn Văn A',
        rating: 4.8,
        totalReviews: 24,
        location: 'Quận 1, TP.HCM'
      },
      location: 'Quận 1, TP.HCM',
      createdAt: '2024-01-15'
    }

    setTimeout(() => {
      setToy(mockToy)
      setLoading(false)
    }, 1000)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container py-16">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin đồ chơi...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!toy) {
    return (
      <div className="min-h-screen">
        <div className="container py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy đồ chơi</h2>
            <Link to="/toys" className="btn btn-primary">
              Về danh sách đồ chơi
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="text-primary-500 hover:text-primary-600">Trang chủ</Link>
          <span>›</span>
          <Link to="/toys" className="text-primary-500 hover:text-primary-600">Đồ chơi</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">{toy.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
                <span className="text-8xl opacity-60">🤖</span>
                <div className="absolute top-4 right-4">
                  <span className="badge badge-success">🟢 Có sẵn</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="badge badge-primary">🤖 Điện tử</span>
                <span className="badge badge-success">Như mới</span>
                <span className="badge badge-secondary">6-8 tuổi</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{toy.name}</h1>

              <div className="flex items-center space-x-6 text-gray-600 mb-6">
                <span>📍 {toy.location}</span>
                <span>📅 Đăng {new Date(toy.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📝 Mô tả</h3>
                <p className="text-gray-700 leading-relaxed">{toy.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Owner Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {toy.owner.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{toy.owner.name}</h4>
                  <div className="text-sm text-gray-600">
                    ⭐ {toy.owner.rating} ({toy.owner.totalReviews} đánh giá)
                  </div>
                  <div className="text-sm text-gray-500">{toy.owner.location}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Link to={`/profile/${toy.owner.id}`} className="w-full btn btn-outline btn-sm">
                  👤 Xem hồ sơ
                </Link>
                <button className="w-full btn btn-ghost btn-sm">
                  💬 Nhắn tin
                </button>
              </div>
            </div>

            {/* Booking */}
            {toy.status === 'available' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📅 Đặt mượn đồ chơi</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Liên hệ với chủ sở hữu để thỏa thuận thời gian và địa điểm giao nhận.
                </p>

                <button className="w-full btn btn-primary btn-lg mb-4">
                  <span>📞</span>
                  <span>Liên hệ mượn</span>
                </button>

                <div className="bg-yellow-50 rounded-lg p-3">
                  <h4 className="font-semibold text-yellow-800 mb-2">💡 Mẹo nhỏ:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Hỏi về tình trạng đồ chơi</li>
                    <li>• Thỏa thuận thời gian rõ ràng</li>
                    <li>• Gặp mặt tại địa điểm an toàn</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToyDetail