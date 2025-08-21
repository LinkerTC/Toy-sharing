import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center hero-bg p-4 relative overflow-hidden">

      {/* Floating Toys */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🧸', '🚗', '🎨', '⚽'].map((emoji, index) => (
          <div
            key={index}
            className="floating-toy text-6xl"
            style={{
              top: `${10 + (index * 25)}%`,
              left: `${10 + (index * 20)}%`,
              animationDelay: `${index * 1.5}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="text-center relative z-10 max-w-lg">

        {/* Animated 404 */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            {['4', '0', '4'].map((digit, index) => (
              <span 
                key={index}
                className="text-8xl md:text-9xl font-bold gradient-text animate-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {digit}
              </span>
            ))}
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Trang không tồn tại 😅
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Có vẻ như trang bạn đang tìm kiếm đã bị mất hoặc không tồn tại. 
            Đừng lo lắng, chúng ta sẽ giúp bạn tìm lại con đường!
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🎯 Bạn có thể thử:
          </h3>
          <div className="space-y-3 text-left">
            {[
              { icon: '🏠', text: 'Về trang chủ', action: '/' },
              { icon: '🧸', text: 'Xem đồ chơi', action: '/toys' },
              { icon: '🔍', text: 'Kiểm tra lại URL trong thanh địa chỉ' },
              { icon: '📧', text: 'Liên hệ hỗ trợ', action: 'mailto:support@toysharing.com' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary-50 transition-colors">
                <span className="text-xl">{item.icon}</span>
                {item.action && item.action.startsWith('/') ? (
                  <Link to={item.action} className="text-primary-600 hover:text-primary-700 font-medium">
                    {item.text}
                  </Link>
                ) : item.action ? (
                  <a href={item.action} className="text-primary-600 hover:text-primary-700 font-medium">
                    {item.text}
                  </a>
                ) : (
                  <span className="text-gray-600">{item.text}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/" className="btn btn-primary btn-lg">
            <span>🏠</span>
            <span>Về trang chủ</span>
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline btn-lg"
          >
            <span>↩️</span>
            <span>Quay lại</span>
          </button>
        </div>

        {/* Fun Fact */}
        <div className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl p-4 text-left">
          <div className="flex items-start space-x-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div className="text-sm text-gray-700">
              <strong className="text-primary-600">Bạn có biết?</strong> Số 404 được đặt tên theo phòng 404 tại CERN - 
              nơi máy chủ web đầu tiên được đặt!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound