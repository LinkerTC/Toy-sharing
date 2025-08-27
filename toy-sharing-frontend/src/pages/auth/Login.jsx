import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

  const { login } = useAuth()
  // Fix: Dùng đúng method names từ NotificationContext của user
  const { notifySuccess, notifyError } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  
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
    console.log('🔑 Login attempt with:', { email: formData.email, password: '***hidden***' })

    if (!validateForm()) {
      console.log('❌ Validation failed:', errors)
      return
    }

    setIsSubmitting(true)

    try {
      console.log('🔄 Calling login function...')
      const result = await login(formData.email, formData.password)
      console.log('📄 Login result:', result)

      // Fix: Check for success more carefully
      if (result && result.success !== false && !result.error) {
        // SUCCESS - Go to home page
        console.log('✅ Login successful, preparing redirect...')
        notifySuccess('Đăng nhập thành công', 'Chào mừng bạn trở lại!')

        // Force redirect after a short delay to ensure state updates
        setTimeout(() => {
          console.log('🏠 Redirecting to home...')
          navigate('/', { replace: true })
          window.location.reload();
        }, 100)

      } else {
        // FAILED - Stay on login page
        console.log('❌ Login failed:', result)
        const errorMsg = result?.error || result?.message || 'Email hoặc mật khẩu không đúng'
        // notifyError('Đăng nhập thất bại', errorMsg)

        // Clear password field on error
        setFormData(prev => ({ ...prev, password: '' }))
      }
    } catch (err) {
      console.error('💥 Login error:', err)
      notifyError('Lỗi đăng nhập', 'Có lỗi xảy ra. Vui lòng thử lại.')
      setFormData(prev => ({ ...prev, password: '' }))
    } finally {
      setIsSubmitting(false)
    }
  }


  // Google Login callback handler
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;
    setGoogleLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/auth/google', {
        token: credentialResponse.credential
      });
      localStorage.setItem('token', res.data.token);
      // If success, redirect to home
      navigate("/");
    } catch (err) {
      // You might want to show error here
      // Optionally: setErrors({ google: "Đăng nhập Google thất bại" });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    // Optionally handle failure
    // setErrors({ google: "Đăng nhập Google thất bại" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 relative overflow-hidden">

      {/* Floating Toys Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🧸', '🚗', '🎨', '⚽', '🤖'].map((emoji, index) => (
          <div
            key={index}
            className="absolute text-4xl opacity-20 animate-bounce"
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
              <span className="text-4xl animate-bounce">🧸</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Toy Sharing
              </span>
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
            <p className="text-gray-600">
              Chào mừng bạn trở lại! Hãy đăng nhập để tiếp tục chia sẻ niềm vui. 👋
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Email
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-pink-500'
                }`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <div className="flex items-center space-x-2 text-red-500 text-sm mt-2">
                  <span>⚠️</span>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Mật khẩu
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-pink-500'
                }`}
                disabled={isSubmitting}
              />
              {errors.password && (
                <div className="flex items-center space-x-2 text-red-500 text-sm mt-2">
                  <span>⚠️</span>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="text-pink-500 hover:text-pink-600 font-medium">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🔐</span>
                  <span>Đăng nhập</span>
                </div>
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
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                text="signin_with"
                width="100%"
                useOneTap={false}
                shape="rectangular"
                theme="outline"
                size="large"
                logo_alignment="left"
                disabled={googleLoading}
              />
            </div>
            {/* Optionally show loading indicator */}
            {googleLoading && (
              <div className="flex justify-center mt-2">
                <div className="spinner-sm"></div>
                <span className="ml-2 text-gray-500">Đang đăng nhập với Google...</span>
              </div>
            )}
          </div>


          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <span>Chưa có tài khoản?</span>
            <Link to="/register" className="ml-2 text-pink-500 hover:text-pink-600 font-semibold">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login