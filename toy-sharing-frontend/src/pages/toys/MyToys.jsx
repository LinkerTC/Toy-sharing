import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MyToys = () => {
  const { user } = useAuth()
  const [toys, setToys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock user's toys
    const mockToys = [
      {
        id: '1',
        name: 'Robot Transformer Optimus Prime',
        category: 'electronic',
        condition: 'like-new',
        status: 'available',
        views: 45,
        interested: 8,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Bộ đồ chơi xếp hình LEGO',
        category: 'construction', 
        condition: 'good',
        status: 'borrowed',
        borrower: 'Trần Thị B',
        views: 32,
        interested: 5,
        createdAt: '2024-01-10'
      }
    ]

    setTimeout(() => {
      setToys(mockToys)
      setLoading(false)
    }, 1000)
  }, [])

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              💼 Đồ chơi của tôi
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi các đồ chơi bạn đang chia sẻ
            </p>
          </div>

          <Link to="/toys/create" className="btn btn-primary mt-4 sm:mt-0">
            <span>➕</span>
            <span>Thêm đồ chơi</span>
          </Link>
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
                <div className="text-2xl font-bold text-gray-900">
                  {toys.filter(t => t.status === 'available').length}
                </div>
                <div className="text-gray-600">Có sẵn</div>
              </div>
              <div className="text-3xl">🟢</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {toys.filter(t => t.status === 'borrowed').length}
                </div>
                <div className="text-gray-600">Đang mượn</div>
              </div>
              <div className="text-3xl">🟡</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-secondary-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-gray-600">Chờ duyệt</div>
              </div>
              <div className="text-3xl">🟠</div>
            </div>
          </div>
        </div>

        {/* Toys List */}
        <div className="bg-white rounded-2xl shadow-lg">
          {toys.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {toys.map(toy => (
                <div key={toy.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">

                    {/* Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center relative">
                      <span className="text-2xl">🤖</span>
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full \
                        ${toy.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <span className="badge badge-primary">🤖 Điện tử</span>
                        <span className="badge badge-success">Như mới</span>
                      </div>

                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{toy.name}</h3>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>👀 {toy.views} lượt xem</span>
                        <span>❤️ {toy.interested} quan tâm</span>
                        <span>📅 {new Date(toy.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>

                      {toy.status === 'borrowed' && toy.borrower && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                          <span className="text-sm text-yellow-700">
                            👤 Đang mượn: {toy.borrower}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link 
                        to={`/toys/${toy.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        👀 Xem
                      </Link>
                      <Link 
                        to={`/toys/${toy.id}/edit`}
                        className="btn btn-ghost btn-sm"
                      >
                        ✏️ Sửa
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🧸</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Chưa có đồ chơi nào
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy bắt đầu chia sẻ đồ chơi đầu tiên của bạn!
              </p>
              <Link to="/toys/create" className="btn btn-primary">
                <span>➕</span>
                <span>Thêm đồ chơi</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyToys