import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '', // Added address field
    acceptTerms: false
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register } = useAuth()
  const { success, error } = useNotifications()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Tên là bắt buộc'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Họ là bắt buộc'
    }

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (formData.phone && !/^[0-9]{9,11}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc'
    } else if (formData.address.length < 5) {
      newErrors.address = 'Địa chỉ phải có ít nhất 5 ký tự'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Bạn phải đồng ý với điều khoản sử dụng'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!validateForm()) return

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          profile: {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phone: formData.phone,
            address: formData.address.trim()
          }
        })
      });
      const result = await response.json();

      if (result.success) {
        success(result.message || 'Đăng ký thành công!')
        
      }
      error(result.message || result.error || 'Đăng ký thất bại')
    } catch (err) {
      error('Có lỗi xảy ra. Vui lòng thử lại.')
    }
    finally {
      setIsSubmitting(false)
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center hero-bg p-4 py-12 relative overflow-hidden">
      {/* Floating Toys Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🧸', '🚗', '🎨', '⚽', '🤖', '🎪'].map((emoji, index) => (
          <div
            key={index}
            className="floating-toy"
            style={{
              top: `${10 + (index * 15)}%`,
              left: `${5 + (index * 15)}%`,
              animationDelay: `${index * 1.8}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">

          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 text-decoration-none mb-6">
              <span className="text-4xl animate-bounce-slow">🧸</span>
              <span className="text-2xl font-bold gradient-text">Toy Sharing</span>
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h1>
            <p className="text-gray-600">
              Tạo tài khoản để bắt đầu chia sẻ và khám phá thế giới đồ chơi tuyệt vời!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Tên
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                  placeholder="Tên của bạn"
                  disabled={isSubmitting}
                />
                {errors.firstName && (
                  <div className="form-error">
                    <span>⚠️</span>
                    <span>{errors.firstName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">
                  Họ
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-input ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                  placeholder="Họ của bạn"
                  disabled={isSubmitting}
                />
                {errors.lastName && (
                  <div className="form-error">
                    <span>⚠️</span>
                    <span>{errors.lastName}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">
                Email
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                placeholder="Nhập email của bạn"
                disabled={isSubmitting}
              />
              {errors.email && (
                <div className="form-error">
                  <span>⚠️</span>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="form-label">
                Địa chỉ
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`form-input ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                placeholder="Nhập địa chỉ của bạn"
                disabled={isSubmitting}
              />
              {errors.address && (
                <div className="form-error">
                  <span>⚠️</span>
                  <span>{errors.address}</span>
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Số điện thoại (tùy chọn)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                placeholder="0912345678"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <div className="form-error">
                  <span>⚠️</span>
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Mật khẩu
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                  placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <div className="form-error">
                    <span>⚠️</span>
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">
                  Xác nhận mật khẩu
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                  placeholder="Nhập lại mật khẩu"
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && (
                  <div className="form-error">
                    <span>⚠️</span>
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">
                  Tôi đồng ý với{' '}
                  <Link to="/terms" target="_blank" className="text-primary-500 hover:text-primary-600 font-medium">
                    Điều khoản sử dụng
                  </Link>
                  {' '}và{' '}
                  <Link to="/privacy" target="_blank" className="text-primary-500 hover:text-primary-600 font-medium">
                    Chính sách bảo mật
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <div className="form-error mt-2">
                  <span>⚠️</span>
                  <span>{errors.acceptTerms}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-sm"></div>
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <span>🎉</span>
                  <span>Tạo tài khoản</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">hoặc</span>
            </div>
          </div>

          {/* Social Register */}
          <div className="space-y-3">
            <button className="w-full btn btn-outline">
              <span>📘</span>
              <span>Đăng ký với Facebook</span>
            </button>
            <button className="w-full btn btn-outline">
              <span>🌐</span>
              <span>Đăng ký với Google</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <span>Đã có tài khoản?</span>
            <Link to="/login" className="ml-2 text-primary-500 hover:text-primary-600 font-semibold">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register