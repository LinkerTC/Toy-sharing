// pages/toys/MyToys.jsx
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const DEFAULT_LIMIT = 10

const MyToys = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [toys, setToys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: DEFAULT_LIMIT,
    hasNext: false,
    hasPrev: false,
  })

  // + pending cho "Chờ duyệt"
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || DEFAULT_LIMIT,
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
  })

  const statusInfo = useMemo(() => ({
    available: { label: 'Có sẵn', dot: 'bg-green-500', badge: 'badge-success' },
    borrowed:  { label: 'Đang mượn', dot: 'bg-yellow-500', badge: 'badge-warning' },
    pending:   { label: 'Chờ duyệt', dot: 'bg-orange-500', badge: 'badge-accent' },
  }), [])

  const buildQuery = (params) => {
    const q = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.set(k, v)
    })
    return q.toString()
  }

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  })

  // Fetch my-toys
  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const qs = buildQuery(filters)
        const res = await fetch(`http://localhost:3000/api/toys/my-toys?${qs}`, {
          signal: controller.signal,
          headers: authHeaders(),
          credentials: 'include',
        })
        const text = await res.text()
        let json
        try { json = JSON.parse(text) } catch { json = { error: { message: text } } }
        if (!res.ok) throw new Error(json?.error?.message || 'Không thể tải đồ chơi của bạn')

        setToys(json?.data?.toys || [])
        setPagination(json?.data?.pagination || {
          currentPage: 1, totalPages: 1, totalItems: 0, limit: filters.limit, hasNext: false, hasPrev: false
        })
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError(e.message || 'Đã có lỗi xảy ra')
          setToys([])
        }
      } finally {
        setLoading(false)
      }
    }
    if (token) load()
    return () => controller.abort()
  }, [filters, token])

  // Pagination
  const goToPage = (page) => {
    const next = { ...filters, page }
    const qs = buildQuery(next)
    navigate(`/my-toys?${qs}`, { replace: true })
    setFilters(next)
  }

  // Delete handler
  const handleDelete = async (id) => {
    const toy = toys.find(t => t._id === id)
    const name = toy?.name ? `“${toy.name}”` : 'mục này'
    const ok = window.confirm(`Xóa ${name}? Hành động không thể hoàn tác.`)
    if (!ok) return

    setDeletingId(id)
    try {
      const res = await fetch(`http://localhost:3000/api/toys/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
        credentials: 'include',
      })
      const text = await res.text()
      let json
      try { json = JSON.parse(text) } catch { json = { error: { message: text } } }
      if (!res.ok) throw new Error(json?.error?.message || 'Không thể xóa đồ chơi')

      // Cập nhật danh sách hiện tại (xóa khỏi state)
      setToys(prev => prev.filter(t => t._id !== id))

      // Cập nhật lại pagination tại chỗ
      setPagination(prev => {
        const totalItems = Math.max(0, (prev.totalItems || 0) - 1)
        const totalPages = Math.max(1, Math.ceil(totalItems / (prev.limit || DEFAULT_LIMIT)))
        const currentPage = Math.min(prev.currentPage, totalPages)
        return {
          ...prev,
          totalItems,
          totalPages,
          currentPage,
          hasPrev: currentPage > 1,
          hasNext: currentPage < totalPages,
        }
      })

      // Nếu trang hiện tại hết item, refetch để lấy trang trước
      setTimeout(() => {
        if (toys.length === 1 && pagination.currentPage > 1) {
          goToPage(pagination.currentPage - 1)
        }
      }, 0)
    } catch (e) {
      alert(e.message || 'Xóa thất bại, vui lòng thử lại.')
    } finally {
      setDeletingId(null)
    }
  }

  // Stats
  const totalAvailable = useMemo(() => toys.filter(t => t.status === 'available').length, [toys])
  const totalBorrowed  = useMemo(() => toys.filter(t => t.status === 'borrowed').length, [toys])
  const totalPending   = useMemo(() => toys.filter(t => t.status === 'pending').length,  [toys])

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container py-16">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách đồ chơi...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">💼 Đồ chơi của tôi</h1>
            <p className="text-gray-600 truncate">Quản lý và theo dõi các đồ chơi bạn đang chia sẻ</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => {
                  const next = { ...filters, status: e.target.value, page: 1 }
                  const qs = buildQuery(next)
                  navigate(`/my-toys?${qs}`, { replace: true })
                  setFilters(next)
                }}
                className="h-10 px-8 rounded-xl border- border-gray-200 focus:border-pink-500 outline-none text-sm"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="available">Có sẵn</option>
                <option value="borrowed">Đang mượn</option>
                <option value="pending">Chờ duyệt</option>
              </select>
              
            </div>

            <Link
              to="/toys/create"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <span className="text-base leading-none">➕</span>
              <span>Thêm đồ chơi</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{toys.length}</div>
                <div className="text-gray-600">Tổng số</div>
              </div>
              <div className="text-3xl">🧸</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalAvailable}</div>
                <div className="text-gray-600">Có sẵn</div>
              </div>
              <div className="text-3xl">🟢</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalBorrowed}</div>
                <div className="text-gray-600">Đang mượn</div>
              </div>
              <div className="text-3xl">🟡</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalPending}</div>
                <div className="text-gray-600">Chờ duyệt</div>
              </div>
              <div className="text-3xl">🟠</div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-lg">
          {error && (
            <div className="p-6 text-red-600 text-sm">{error}</div>
          )}

          {!error && toys.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {toys.map(toy => {
                const info = statusInfo[toy.status] || statusInfo.available
                const createdDate = toy.createdAt
                  ? new Date(toy.createdAt).toLocaleDateString('vi-VN')
                  : ''

                const isDeleting = deletingId === toy._id

                return (
                  <div key={toy._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center relative shrink-0">
                        <span className="text-2xl">{(toy.category && toy.category.icon) || '🧸'}</span>
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${info.dot}`}></div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-2 mb-2 flex-wrap">
                          <span className="badge badge-primary">
                            {(toy.category && toy.category.icon) || '🧸'} {(toy.category && (toy.category.displayName || toy.category.name)) || 'Danh mục'}
                          </span>
                          <span className="badge badge-success">
                            {toy.condition === 'like-new' ? 'Như mới'
                              : toy.condition === 'new' ? 'Mới'
                              : toy.condition === 'good' ? 'Tốt' : 'Ổn'}
                          </span>
                          <span className={info.badge}>{info.label}</span>
                        </div>

                        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{toy.name}</h3>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📅 {createdDate}</span>
                          <span className="text-pink-600 font-semibold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(toy.price || 0))}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        <Link to={`/toys/${toy._id}`} className="btn btn-outline btn-sm">👀 Xem</Link>
                        <Link to={`/toys/${toy._id}/edit`} className="btn btn-ghost btn-sm">✏️ Sửa</Link>
                        <button
                          className={`btn btn-ghost btn-sm text-red-600 hover:bg-red-50 ${isDeleting ? 'opacity-60 cursor-not-allowed' : ''}`}
                          onClick={() => !isDeleting && handleDelete(toy._id)}
                          disabled={isDeleting}
                          title="Xóa đồ chơi"
                        >
                          {isDeleting ? '⏳ Đang xóa...' : '🗑️ Xóa'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : !error && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🧸</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Chưa có đồ chơi nào</h3>
              <p className="text-gray-600 mb-6">Hãy bắt đầu chia sẻ đồ chơi đầu tiên của bạn!</p>
              <Link
                to="/toys/create"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                <span className="text-base leading-none">➕</span>
                <span>Thêm đồ chơi</span>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
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

export default MyToys
