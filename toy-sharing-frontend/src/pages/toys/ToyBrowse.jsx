// pages/toys/Toys.jsx
import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'

const DEFAULT_LIMIT = 12

const Toys = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 1) State áp dụng (fetch)
  const [appliedFilters, setAppliedFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    ageGroup: searchParams.get('ageGroup') || '',
    status: searchParams.get('status') || 'available',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || DEFAULT_LIMIT,
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
  })

  // 2) State nhập liệu (không trigger fetch ngay khi gõ)
  const [localFilters, setLocalFilters] = useState(appliedFilters)

  // 3) Debounce 500ms để sync local -> applied, rồi update URL
  const debounceTimer = useRef(null)
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      const next = { ...localFilters, page: 1 } // đổi filter → về trang 1
      setAppliedFilters(next)

      const qs = new URLSearchParams()
      Object.entries(next).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') qs.set(k, v)
      })
      navigate(`/toys?${qs.toString()}`, { replace: true })
    }, 2000)
    return () => clearTimeout(debounceTimer.current)
  }, [localFilters, navigate])

  // 4) Fetch theo appliedFilters
  const [toys, setToys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1, totalPages: 1, totalItems: 0, limit: DEFAULT_LIMIT, hasNext: false, hasPrev: false
  })

  useEffect(() => {
    const controller = new AbortController()
    const loadToys = async () => {
      setLoading(true)
      setError('')
      try {
        const qs = new URLSearchParams()
        Object.entries(appliedFilters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') qs.set(k, v)
        })
        const res = await fetch(`http://localhost:3000/api/toys?${qs.toString()}`, { signal: controller.signal })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error?.message || 'Lỗi tải dữ liệu')

        setToys(json?.data?.toys || [])
        setPagination(json?.data?.pagination || {
          currentPage: 1, totalPages: 1, totalItems: 0, limit: appliedFilters.limit, hasNext: false, hasPrev: false
        })
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError(e.message || 'Không thể tải dữ liệu')
          setToys([])
        }
      } finally {
        setLoading(false)
      }
    }
    loadToys()
    return () => controller.abort()
  }, [appliedFilters])

  // 5) Ngăn Enter làm submit form và mất focus
  const preventSubmitOnEnter = (e) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  // 6) Điều khiển phân trang (không đụng input)
  const goToPage = (page) => {
    const next = { ...appliedFilters, page }
    setAppliedFilters(next)
    const qs = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, v)
    })
    navigate(`/toys?${qs.toString()}`, { replace: true })
  }

  // Categories fallback khi không có populate
  const categories = useMemo(() => ({
    educational: { label: 'Giáo dục', icon: '📚' },
    construction: { label: 'Xây dựng', icon: '🧱' },
    dolls: { label: 'Búp bê', icon: '🧸' },
    vehicles: { label: 'Xe đồ chơi', icon: '🚗' },
    sports: { label: 'Thể thao', icon: '⚽' },
    arts_crafts: { label: 'Nghệ thuật', icon: '🎨' },
    electronic: { label: 'Điện tử', icon: '🤖' },
    other: { label: 'Khác', icon: '🎮' },
  }), [])

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🧸 Khám phá đồ chơi</h1>
          <p className="text-xl text-gray-600">Tìm kiếm và chia sẻ những món đồ chơi tuyệt vời cho các bé</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* form có onSubmit chặn mặc định để không reload */}
            <form className="flex flex-col lg:flex-row gap-4 items-center" onSubmit={(e) => e.preventDefault()}>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm đồ chơi..."
                  value={localFilters.search}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
                  onKeyDown={preventSubmitOnEnter}
                  className="form-input"
                />
              </div>

              {/* Category: nhận ObjectId hoặc name */}
              <input
                type="text"
                placeholder="Category ID hoặc name"
                value={localFilters.category}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, category: e.target.value }))}
                onKeyDown={preventSubmitOnEnter}
                className="form-input lg:w-64"
              />

              {/* Condition */}
              <select
                value={localFilters.condition}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, condition: e.target.value }))}
                className="form-input lg:w-40"
              >
                <option value="">Tình trạng</option>
                <option value="new">Mới</option>
                <option value="like-new">Như mới</option>
                <option value="good">Tốt</option>
                <option value="fair">Ổn</option>
              </select>

              {/* AgeGroup */}
              <select
                value={localFilters.ageGroup}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, ageGroup: e.target.value }))}
                className="form-input lg:w-40"
              >
                <option value="">Độ tuổi</option>
                <option value="0-2">0-2</option>
                <option value="3-5">3-5</option>
                <option value="6-8">6-8</option>
                <option value="9-12">9-12</option>
                <option value="13-15">13-15</option>
              </select>

              {/* Sort */}
              <select
                value={`${localFilters.sortBy}:${localFilters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split(':')
                  setLocalFilters(prev => ({ ...prev, sortBy, sortOrder }))
                }}
                className="form-input lg:w-56"
              >
                <option value="createdAt:desc">Mới nhất</option>
                <option value="createdAt:asc">Cũ nhất</option>
                <option value="price:asc">Giá tăng dần</option>
                <option value="price:desc">Giá giảm dần</option>
                <option value="name:asc">Tên A→Z</option>
                <option value="name:desc">Tên Z→A</option>
              </select>

              {/* Nút này chỉ là button để người dùng “kích” áp dụng ngay, vẫn giữ debounce cho gõ thường */}
              <button
                type="button"
                className="btn btn-primary whitespace-nowrap"
                onClick={() => setLocalFilters(prev => ({ ...prev }))} // kích sync ngay (debounce 0 vì state không đổi → không cần)
              >
                🔍 Tìm kiếm
              </button>
            </form>

            {/* Hàng thứ 2: giá và trạng thái */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="number"
                min="0"
                placeholder="Giá từ (VND)"
                value={localFilters.priceMin}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                onKeyDown={preventSubmitOnEnter}
                className="form-input"
              />
              <input
                type="number"
                min="0"
                placeholder="Giá đến (VND)"
                value={localFilters.priceMax}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                onKeyDown={preventSubmitOnEnter}
                className="form-input"
              />
              <select
                value={localFilters.status}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, status: e.target.value }))}
                className="form-input"
              >
                <option value="available">Có sẵn</option>
                <option value="borrowed">Đang mượn</option>
              </select>
            </div>

            {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
          </div>
        </div>

        {/* Toys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {toys.map((toy) => {
            const catObj = typeof toy.category === 'object' ? toy.category : null
            const catKey = catObj?.name || toy.category || 'other'
            const category = categories[catKey] || { label: catObj?.displayName || 'Danh mục', icon: catObj?.icon || '🧸' }

            return (
              <div key={toy._id} className="card-toy">
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
                  <span className="text-6xl opacity-60">{category.icon}</span>
                  <div className="absolute top-3 right-3">
                    <span className={`badge ${toy.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                      {toy.status === 'available' ? '🟢 Có sẵn' : '🟡 Đang mượn'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="badge badge-primary">
                      {category.icon} {category.label}
                    </span>
                    <span className="badge badge-success">
                      {toy.condition === 'like-new' ? 'Như mới'
                        : toy.condition === 'new' ? 'Mới'
                        : toy.condition === 'good' ? 'Tốt' : 'Ổn'}
                    </span>
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
                    📍 {toy.pickupAddress}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link to={`/toys/${toy._id}`} className="w-full btn btn-primary btn-sm">
                      👀 Xem chi tiết
                    </Link>
                    <button className="w-full btn btn-outline btn-sm" disabled={toy.status !== 'available'}>
                      📅 Đặt mượn
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {!loading && !error && toys.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Không tìm thấy đồ chơi</h3>
            <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={!pagination.hasPrev}
            onClick={() => goToPage(Math.max(1, pagination.currentPage - 1))}
          >
            ← Trước
          </button>
          <span className="text-sm text-gray-600">
            Trang {pagination.currentPage} / {pagination.totalPages} • {pagination.totalItems} mục
          </span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={!pagination.hasNext}
            onClick={() => goToPage(Math.min(pagination.totalPages, pagination.currentPage + 1))}
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toys
