import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const Settings = () => {
  const { user, logout } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteAccount = () => {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
      // Handle account deletion
      alert('Tài khoản đã được xóa!')
      logout()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ⚙️ Cài đặt tài khoản
          </h1>
          <p className="text-gray-600">
            Quản lý cài đặt và tùy chọn cho tài khoản của bạn
          </p>
        </div>

        <div className="space-y-6">

          {/* Account Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">👤 Tài khoản</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-pink-500 transition-colors">
                <div>
                  <h4 className="font-semibold text-gray-900">Thông tin cá nhân</h4>
                  <p className="text-sm text-gray-600">Cập nhật thông tin hồ sơ của bạn</p>
                </div>
                <a href="/profile/edit" className="bg-pink-100 text-pink-600 px-4 py-2 rounded-lg font-medium hover:bg-pink-200 transition-colors">
                  Chỉnh sửa
                </a>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-pink-500 transition-colors">
                <div>
                  <h4 className="font-semibold text-gray-900">Đổi mật khẩu</h4>
                  <p className="text-sm text-gray-600">Cập nhật mật khẩu để bảo mật tài khoản</p>
                </div>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">🔔 Thông báo</h2>

            <div className="space-y-4">
              {[
                { title: 'Email thông báo', desc: 'Nhận thông báo qua email về hoạt động tài khoản', checked: true },
                { title: 'Thông báo đặt mượn', desc: 'Thông báo khi có người muốn mượn đồ chơi', checked: true },
                { title: 'Thông báo trả về', desc: 'Nhắc nhở về thời hạn trả đồ chơi', checked: true },
                { title: 'Thông báo khuyến mãi', desc: 'Nhận thông tin về các chương trình khuyến mãi', checked: false }
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-900">{setting.title}</h4>
                    <p className="text-sm text-gray-600">{setting.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={setting.checked} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">🔒 Quyền riêng tư</h2>

            <div className="space-y-4">
              {[
                { title: 'Hồ sơ công khai', desc: 'Cho phép người khác xem hồ sơ của bạn', checked: true },
                { title: 'Hiển thị số điện thoại', desc: 'Cho phép người dùng khác xem số điện thoại', checked: false },
                { title: 'Hiển thị email', desc: 'Cho phép liên hệ qua email', checked: false },
                { title: 'Theo dõi hoạt động', desc: 'Ghi nhận hoạt động để cải thiện dịch vụ', checked: true }
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-900">{setting.title}</h4>
                    <p className="text-sm text-gray-600">{setting.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={setting.checked} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-red-600 mb-6">⚠️ Vùng nguy hiểm</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50">
                <div>
                  <h4 className="font-semibold text-red-900">Xóa tài khoản</h4>
                  <p className="text-sm text-red-700">Xóa vĩnh viễn tài khoản và tất cả dữ liệu</p>
                </div>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Xóa tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Xóa tài khoản?</h3>
                <p className="text-gray-600">
                  Hành động này không thể hoàn tác. Tất cả dữ liệu và đồ chơi của bạn sẽ bị xóa vĩnh viễn.
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Xóa tài khoản
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings