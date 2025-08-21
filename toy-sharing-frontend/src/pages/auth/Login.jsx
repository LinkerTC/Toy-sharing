import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const { success, error } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'
  console.log('Redirecting to:', from)
 
  const validateForm = () => {
    const newErrors = {}

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const result = await login(formData.email, formData.password)
console.log('Login result:', result)
      if (result) {
        // success('Đăng nhập thành công! 🎉')
        // console.log("111111", result)
        // navigate(from, { replace: true })
        navigate("/")
      } else {
        error(result.error || 'Đăng nhập thất bại')
      }
    } catch (err) {
      error('Có lỗi xảy ra. Vui lòng thử lại.')
    }
 finally{
   setIsSubmitting(false)
 }
  }

  return (
    <div className="min-h-screen flex items-center justify-center hero-bg p-4 relative overflow-hidden">

      {/* Floating Toys Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🧸', '🚗', '🎨', '⚽', '🤖'].map((emoji, index) => (
          <div
            key={index}
            className="floating-toy"
            style={{
              top: `${15 + (index * 20)}%`,
              left: `${5 + (index * 18)}%`,
              animationDelay: `${index * 2}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">

          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 text-decoration-none mb-6">
              <span className="text-4xl animate-bounce-slow">🧸</span>
              <span className="text-2xl font-bold gradient-text">Toy Sharing</span>
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
            <p className="text-gray-600">
              Chào mừng bạn trở lại! Hãy đăng nhập để tiếp tục chia sẻ niềm vui.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

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
                Mật khẩu
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                placeholder="Nhập mật khẩu"
                disabled={isSubmitting}
              />
              {errors.password && (
                <div className="form-error">
                  <span>⚠️</span>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="text-primary-500 hover:text-primary-600 font-medium">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-sm"></div>
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>🔐</span>
                  <span>Đăng nhập</span>
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

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full btn btn-outline">
              <span>📘</span>
              <span>Đăng nhập với Facebook</span>
            </button>
            <button className="w-full btn btn-outline">
              <span>🌐</span>
              <span>Đăng nhập với Google</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <span>Chưa có tài khoản?</span>
            <Link to="/register" className="ml-2 text-primary-500 hover:text-primary-600 font-semibold">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login