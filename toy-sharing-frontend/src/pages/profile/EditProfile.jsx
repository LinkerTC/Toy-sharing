import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const EditProfile = () => {
  const navigate = useNavigate()
  const { user, updateUser, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  })
  const [errors, setErrors] = useState({})

  // Debug logs
  console.log('EditProfile rendering...')
  console.log('User:', user)
  console.log('IsLoading:', isLoading)

  useEffect(() => {
    console.log('EditProfile useEffect - user changed:', user)
    if (user) {
      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: user.profile?.address || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'Tên là bắt buộc'
    if (!formData.lastName.trim()) newErrors.lastName = 'Họ là bắt buộc'
    if (!formData.email.trim()) newErrors.email = 'Email là bắt buộc'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)

    if (!validateForm()) {
      console.log('Validation failed:', errors)
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update user context
      if (updateUser) {
        updateUser({
          profile: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address: formData.address,
          }
        })
      }
      const response = await axios.put('http://localhost:3000/api/users/profile',
        {
          profile: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address: formData.address,
          }
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      console.log(response.data)

      alert('Cập nhật thông tin thành công! ✅')
      navigate('/profile')
    } catch (error) {
      console.error('Update error:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }
    setIsSubmitting(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  // Error state - if no user after loading
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy thông tin người dùng</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập lại để tiếp tục.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ✏️ Chỉnh sửa hồ sơ
          </h1>
          <p className="text-gray-600">
            Cập nhật thông tin cá nhân của bạn
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Avatar Upload */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                {user?.profile?.firstName?.charAt(0)?.toUpperCase() || 
                 user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button
                type="button"
                className="text-pink-500 hover:text-pink-600 font-medium text-sm"
                onClick={() => alert('Chức năng upload ảnh đang phát triển')}
              >
                📷 Thay đổi ảnh đại diện
              </button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>
                <label className="block font-medium mb-2 text-gray-700">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'
                  }`}
                  disabled={isSubmitting}
                  placeholder="Nhập tên của bạn"
                />
                {errors.firstName && <div className="text-red-500 text-sm mt-2">{errors.firstName}</div>}
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-700">
                  Họ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'
                  }`}
                  disabled={isSubmitting}
                  placeholder="Nhập họ của bạn"
                />
                {errors.lastName && <div className="text-red-500 text-sm mt-2">{errors.lastName}</div>}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 bg-gray-50 cursor-not-allowed"
                disabled={true}
                placeholder="Email không thể thay đổi"
              />
              <p className="text-sm text-gray-500 mt-1">📧 Email không thể thay đổi</p>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">
                📱 Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="0912345678"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">
                📍 Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="VD: Quận 1, TP.HCM"
                disabled={isSubmitting}
              />
            </div>

            {/* <div>
              <label className="block font-medium mb-2 text-gray-700">
                ✏️ Giới thiệu bản thân
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors resize-none"
                placeholder="Chia sẻ một chút về bản thân và sở thích của bạn..."
                disabled={isSubmitting}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 ký tự
              </div>
            </div> */}

            {/* Privacy Settings */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Cài đặt riêng tư</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">Hiển thị số điện thoại</div>
                    <div className="text-sm text-gray-500">Cho phép người khác xem số điện thoại của bạn</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">Hiển thị địa chỉ chính xác</div>
                    <div className="text-sm text-gray-500">Cho phép người khác xem địa chỉ cụ thể</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                disabled={isSubmitting}
              >
                ❌ Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-4 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang cập nhật...
                  </div>
                ) : (
                  '💾 Lưu thay đổi'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <button 
              onClick={() => navigate('/profile')}
              className="hover:text-pink-500 transition-colors"
            >
              👤 Xem hồ sơ
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="hover:text-pink-500 transition-colors"
            >
              ⚙️ Cài đặt
            </button>
            <button 
              onClick={() => navigate('/my-toys')}
              className="hover:text-pink-500 transition-colors"
            >
              🧸 Đồ chơi của tôi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile