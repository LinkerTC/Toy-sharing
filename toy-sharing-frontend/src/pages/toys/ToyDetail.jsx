// pages/toys/ToyDetail.jsx
import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import BookingForm from '@/components/features/bookings/BookingForm'

const ToyDetail = () => {
  const { id } = useParams()
  const [toy, setToy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // Fallback categories nếu server chưa populate
  const fallbackCategories = useMemo(() => ({
    educational: { label: 'Giáo dục', icon: '📚' },
    construction: { label: 'Xây dựng', icon: '🧱' },
    dolls: { label: 'Búp bê', icon: '🧸' },
    vehicles: { label: 'Xe đồ chơi', icon: '🚗' },
    sports: { label: 'Thể thao', icon: '⚽' },
    arts_crafts: { label: 'Nghệ thuật', icon: '🎨' },
    electronic: { label: 'Điện tử', icon: '🤖' },
    other: { label: 'Khác', icon: '🎮' },
  }), [])

  useEffect(() => {
    const controller = new AbortController()
    const fetchDetail = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`http://localhost:3000/api/toys/${id}`, { signal: controller.signal })
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json?.error?.message || 'Không thể tải đồ chơi')
        }
        // API trả: { success, data: { toy } }
        setToy(json?.data?.toy || null)
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError(e.message || 'Đã có lỗi xảy ra')
          setToy(null)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
    return () => controller.abort()
  }, [id])

  // Booking handlers
  const handleBookingClick = () => {
    setIsBookingModalOpen(true)
  }

  const handleBookingSuccess = () => {
    // Refresh toy data after successful booking
    const controller = new AbortController()
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/toys/${id}`, { signal: controller.signal })
        const json = await res.json()
        if (res.ok) {
          setToy(json?.data?.toy || null)
        }
      } catch (e) {
        // Ignore errors during refresh
      }
    }
    fetchDetail()
  }

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

  if (error || !toy) {
    return (
      <div className="min-h-screen">
        <div className="container py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error ? 'Có lỗi xảy ra' : 'Không tìm thấy đồ chơi'}
            </h2>
            {error && <p className="text-gray-600 mb-4">{error}</p>}
            <Link to="/toys" className="btn btn-primary">Về danh sách đồ chơi</Link>
          </div>
        </div>
      </div>
    )
  }

  // Chuẩn hóa category hiển thị
  const catObj = typeof toy.category === 'object' ? toy.category : null
  const catKey = catObj?.name || toy.category || 'other'
  const category = fallbackCategories[catKey] || { label: catObj?.displayName || 'Danh mục', icon: catObj?.icon || '🧸' }

  const conditionLabel =
    toy.condition === 'like-new' ? 'Như mới' :
    toy.condition === 'new' ? 'Mới' :
    toy.condition === 'good' ? 'Tốt' : 'Ổn'

  const ageLabel = toy.ageGroup || ''
  const createdDate = toy.createdAt
    ? new Date(toy.createdAt).toLocaleDateString('vi-VN')
    : ''

  const images = Array.isArray(toy.images) ? toy.images : []
  const pickupAddress = toy.pickupAddress || ''
  const owner = toy.owner || {}
  const ownerName = `${owner?.profile?.firstName || 'UpdatedName'} ${owner?.profile?.lastName || 'UpdatedLast'}`.trim()
  const ownerInitial = owner?.profile?.firstName?.charAt(0) || 'U'
  const ownerRating = owner?.stats?.rating ?? 0
  const ownerToShared = owner?.stats?.toysShared ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="text-primary-500 hover:text-primary-600">Trang chủ</Link>
          <span>›</span>
          <Link to="/toys" className="text-primary-500 hover:text-primary-600">Đồ chơi</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium line-clamp-1">{toy.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square relative">
                {images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt={toy.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <span className="text-8xl opacity-60">{category.icon}</span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`badge ${toy.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                    {toy.status === 'available' ? '🟢 Có sẵn' : '🟡 Đang mượn'}
                  </span>
                </div>
              </div>
              {/* Thumbnails nếu có nhiều ảnh */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-3">
                  {images.slice(0, 8).map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`thumb-${idx}`}
                      className="w-full h-20 object-cover rounded-lg border"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="badge badge-primary">{category.icon} {category.label}</span>
                <span className="badge badge-success">{conditionLabel}</span>
                {!!ageLabel && <span className="badge badge-secondary">{ageLabel} tuổi</span>}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{toy.name}</h1>

              <div className="flex items-center flex-wrap gap-4 text-gray-600 mb-6">
                <span>📍 {pickupAddress}</span>
                {createdDate && <span>📅 Đăng {createdDate}</span>}
                <span className="text-pink-600 font-semibold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(toy.price || 0))}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📝 Mô tả</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {toy.description}
                </p>
              </div>

              {toy.ownerNotes && (
                <div className="mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">🗒️ Ghi chú của chủ sở hữu</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{toy.ownerNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {ownerInitial}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{ownerName}</h4>
                  <div className="text-sm text-gray-600">
                    ⭐ {ownerRating} • 🧸 {ownerToShared} đồ chơi
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link to={`/profile/${owner?._id || 'owner'}`} className="w-full btn btn-outline btn-sm">
                  👤 Xem hồ sơ
                </Link>
                <button className="w-full btn btn-ghost btn-sm" disabled>
                  💬 Nhắn tin
                </button>
              </div>
            </div>

            {/* Booking / Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">📅 Đặt mượn đồ chơi</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Liên hệ với chủ sở hữu để thỏa thuận thời gian và địa điểm giao nhận.
              </p>

              <button
                className="w-full btn btn-primary btn-lg mb-4"
                disabled={toy.status !== 'available'}
                onClick={handleBookingClick}
                title={toy.status !== 'available' ? 'Đồ chơi đang mượn' : 'Đặt mượn đồ chơi'}
              >
                {toy.status === 'available' ? '📅 Đặt mượn' : '⏳ Đang mượn'}
              </button>

              <div className="bg-yellow-50 rounded-lg p-3">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Mẹo nhỏ:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Hỏi rõ tình trạng và phụ kiện kèm theo</li>
                  <li>• Thỏa thuận thời gian/địa điểm cụ thể</li>
                  <li>• Ưu tiên điểm gặp mặt an toàn</li>
                </ul>
              </div>
            </div>

            {/* More from owner (placeholder) */}
            {/* Có thể bổ sung danh sách các đồ chơi khác của chủ sở hữu */}
          </div>
        </div>

        {/* Booking Modal */}
        <BookingForm
          toy={toy}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      </div>
    </div>
  )
}

export default ToyDetail
