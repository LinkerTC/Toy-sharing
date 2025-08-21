import { Component } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Button from '@/components/ui/Button'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state để next render sẽ show fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error để debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Có thể gửi error tới logging service
    // logErrorToService(error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const isProduction = import.meta.env.PROD

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </motion.div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Ôi không! Có lỗi xảy ra 😞
            </h1>

            {/* Error Description */}
            <p className="text-gray-600 mb-6">
              Đã có lỗi bất ngờ xảy ra. Chúng tôi đã ghi nhận và sẽ khắc phục sớm nhất có thể.
            </p>

            {/* Error Details (Development only) */}
            {!isProduction && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Chi tiết lỗi (Dev only)
                </summary>
                <div className="mt-2 p-3 bg-red-50 rounded-lg text-xs text-red-700 overflow-auto max-h-32">
                  <p className="font-medium mb-2">{this.state.error.toString()}</p>
                  <pre className="whitespace-pre-wrap text-xs">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={this.handleReload}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="w-full"
              >
                Tải lại trang
              </Button>

              <Button
                variant="secondary"
                onClick={this.handleGoHome}
                leftIcon={<Home className="w-4 h-4" />}
                className="w-full"
              >
                Về trang chủ
              </Button>
            </div>

            {/* Support Message */}
            <p className="mt-6 text-sm text-gray-500">
              Nếu lỗi tiếp tục xảy ra, vui lòng liên hệ{' '}
              <a 
                href="mailto:support@toysharing.com" 
                className="text-primary-600 hover:text-primary-700 underline"
              >
                support@toysharing.com
              </a>
            </p>
          </motion.div>
        </div>
      )
    }

    // Nếu không có lỗi, render children bình thường
    return this.props.children
  }
}

export default ErrorBoundary