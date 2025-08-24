import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const Toys = () => {
  const [searchParams] = useSearchParams()
  const [toys, setToys] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    condition: '',
    ageGroup: '',
    sortBy: 'newest'
  })

  // Mock toys data
  const mockToys = [
    {
      id: '1',
      name: 'Robot Transformer Optimus Prime',
      description: 'Robot biến hình cao cấp, chất liệu an toàn cho trẻ em',
      category: 'electronic',
      condition: 'like-new',
      ageGroup: '6-8',
      status: 'available',
      owner: { name: 'Nguyễn Văn A', rating: 4.8 },
      location: 'Quận 1, TP.HCM',
      createdAt: '2024-01-15'
    },
    {
      id: '2', 
      name: 'Bộ đồ chơi xếp hình LEGO Classic',
      description: 'Bộ lego 500 chi tiết, phát triển tư duy sáng tạo',
      category: 'construction',
      condition: 'good',
      ageGroup: '3-5',
      status: 'available',
      owner: { name: 'Trần Thị B', rating: 4.9 },
      location: 'Quận 3, TP.HCM',
      createdAt: '2024-01-10'
    }
  ]

  const categories = {
    'educational': { label: 'Giáo dục', icon: '📚' },
    'construction': { label: 'Xây dựng', icon: '🧱' },
    'dolls': { label: 'Búp bê', icon: '🧸' },
    'vehicles': { label: 'Xe đồ chơi', icon: '🚗' },
    'sports': { label: 'Thể thao', icon: '⚽' },
    'arts': { label: 'Nghệ thuật', icon: '🎨' },
    'electronic': { label: 'Điện tử', icon: '🤖' },
    'other': { label: 'Khác', icon: '🎮' }
  }

  useEffect(() => {
    const loadToys = async () => {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/toys')
      const result = await response.json()
      console.log(result)
      setToys(result.data.toys)   // 👈 Lấy mảng toys bên trong
      setLoading(false)
    }
    loadToys()
  }, [filters])

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container py-16">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải đồ chơi...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧸 Khám phá đồ chơi
          </h1>
          <p className="text-xl text-gray-600">
            Tìm kiếm và chia sẻ những món đồ chơi tuyệt vời cho các bé
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm đồ chơi..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
                  className="form-input"
                />
              </div>

              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
                className="form-input lg:w-48"
              >
                <option value="">Tất cả danh mục</option>
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.icon} {cat.label}</option>
                ))}
              </select>

              <button className="btn btn-primary whitespace-nowrap">
                🔍 Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Toys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {toys.map(toy => {
            const category = categories[toy.category]

            return (
              <div key={toy.id} className="card-toy">
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
                  <span className="text-6xl opacity-60">
                    {category ? category.icon : '🧸'}
                  </span>
                  <div className="absolute top-3 right-3">
                    <span className="badge badge-success">
                      🟢 Có sẵn
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {category && (
                      <span className="badge badge-primary">
                        {category.icon} {category.label}
                      </span>
                    )}
                    <span className="badge badge-success">Như mới</span>
                  </div>

                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {toy.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {toy.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {toy.owner?.profile?.firstName?.charAt(0) || '👤'}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
  {toy.owner?.profile?.firstName} {toy.owner?.profile?.lastName}
</div>
<div className="text-xs text-gray-500">
  ⭐ {toy.owner?.stats?.rating ?? 0}
</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    📍 {toy.location}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link 
                      to={`/toys/${toy.id}`}
                      className="w-full btn btn-primary btn-sm"
                    >
                      👀 Xem chi tiết
                    </Link>
                    <button className="w-full btn btn-outline btn-sm">
                      📅 Đặt mượn
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {toys.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Không tìm thấy đồ chơi
            </h3>
            <p className="text-gray-600 mb-6">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Toys