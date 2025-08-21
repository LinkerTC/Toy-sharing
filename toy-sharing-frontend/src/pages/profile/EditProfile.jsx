import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const EditProfile = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        location: user.profile?.location || '',
        bio: user.profile?.bio || ''
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
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update user context
      updateUser({
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio
        }
      })

      alert('Cập nhật thông tin thành công! ✅')
      navigate('/profile')
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }
    setIsSubmitting(false)
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
                {user?.profile?.firstName?.charAt(0) || 'U'}
              </div>
              <button
                type="button"
                className="text-pink-500 hover:text-pink-600 font-medium text-sm"
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
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                    errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'
                  }`}
                  disabled={isSubmitting}
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
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                    errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'
                  }`}
                  disabled={isSubmitting}
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 bg-gray-50"
                disabled={true}
              />
              <p className="text-sm text-gray-500 mt-1">Email không thể thay đổi</p>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                placeholder="0912345678"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">Địa chỉ</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                placeholder="VD: Quận 1, TP.HCM"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">Giới thiệu bản thân</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                placeholder="Chia sẻ một chút về bản thân và sở thích của bạn..."
                disabled={isSubmitting}
              />
            </div>

            {/* Privacy Settings */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Cài đặt riêng tư</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Hiển thị số điện thoại</div>
                    <div className="text-sm text-gray-500">Cho phép người khác xem số điện thoại của bạn</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
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
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-4 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Đang cập nhật...
                  </>
                ) : (
                  '💾 Lưu thay đổi'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile