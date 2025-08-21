import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 max-w-4xl">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500 relative">
            <div className="absolute inset-0 opacity-20">
              {['🧸', '🚗', '🎨', '⚽'].map((emoji, index) => (
                <div
                  key={index}
                  className="floating-toy text-2xl"
                  style={{
                    top: `${20 + (index * 20)}%`,
                    left: `${15 + (index * 20)}%`,
                    animationDelay: `${index * 2}s`
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-16">
              <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-xl">
                {user?.profile?.firstName?.charAt(0) || 'U'}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </h1>
                <p className="text-gray-600 mb-4">{user?.email}</p>

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-sm text-gray-600">Đồ chơi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">28</div>
                    <div className="text-sm text-gray-600">Lượt mượn</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">⭐ 4.8</div>
                    <div className="text-sm text-gray-600">24 đánh giá</div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-primary"
                >
                  <span>✏️</span>
                  <span>{isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Profile Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">👤 Thông tin cá nhân</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">Tên</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    defaultValue={user?.profile?.firstName} 
                    className="form-input" 
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {user?.profile?.firstName || 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Họ</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    defaultValue={user?.profile?.lastName} 
                    className="form-input" 
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {user?.profile?.lastName || 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Email</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="form-label">Số điện thoại</label>
                {isEditing ? (
                  <input 
                    type="tel" 
                    defaultValue={user?.profile?.phone || ''} 
                    className="form-input" 
                    placeholder="0912345678"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {user?.profile?.phone || 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <button className="btn btn-primary">
                    💾 Lưu thay đổi
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Hoạt động gần đây</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white">
                    🧸
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Đồ chơi đã chia sẻ</div>
                    <div className="text-sm text-gray-600">+2 tuần này</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary-600">12</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                    📤
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Lượt cho mượn</div>
                    <div className="text-sm text-gray-600">+5 tuần này</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">28</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white">
                    ⭐
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Đánh giá trung bình</div>
                    <div className="text-sm text-gray-600">24 đánh giá</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-600">4.8</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile