const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Đăng ký tài khoản',
      description: 'Tạo tài khoản miễn phí và xác thực thông tin để đảm bảo an toàn',
      icon: '📝',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: '02', 
      title: 'Đăng tải đồ chơi',
      description: 'Chụp ảnh và mô tả đồ chơi bạn muốn chia sẻ, chúng tôi sẽ kiểm duyệt',
      icon: '📸',
      color: 'from-green-500 to-emerald-500'
    },
    {
      step: '03',
      title: 'Tìm kiếm & liên hệ',
      description: 'Duyệt qua hàng ngàn đồ chơi và liên hệ trực tiếp với người chia sẻ',
      icon: '🔍',
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: '04',
      title: 'Giao nhận an toàn',
      description: 'Hẹn gặp tại địa điểm an toàn hoặc sử dụng dịch vụ giao hàng',
      icon: '🤝',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const safety = [
    { title: 'Xác thực danh tính', icon: '✅', desc: 'Tất cả thành viên được xác minh' },
    { title: 'Kiểm tra chất lượng', icon: '🔍', desc: 'Đồ chơi được kiểm duyệt kỹ lưỡng' },
    { title: 'Đánh giá tin cậy', icon: '⭐', desc: 'Hệ thống đánh giá minh bạch' },
    { title: 'Hỗ trợ 24/7', icon: '📞', desc: 'Đội ngũ hỗ trợ luôn sẵn sàng' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Cách hoạt động 🛠️
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Chỉ với 4 bước đơn giản, bạn có thể bắt đầu chia sẻ và nhận những món đồ chơi tuyệt vời
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-lg`}>
                  {step.step}
                </div>

                {/* Icon */}
                <div className="text-5xl text-center mb-4">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 text-gray-300 text-3xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              An toàn là ưu tiên hàng đầu 🛡️
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết tạo ra một môi trường an toàn và tin cậy cho tất cả các gia đình
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safety.map((item, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Câu hỏi thường gặp ❓
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Tôi có cần trả phí để sử dụng dịch vụ không?',
                a: 'Toy Sharing hoàn toàn miễn phí! Bạn chỉ cần đăng ký tài khoản và có thể bắt đầu chia sẻ ngay.'
              },
              {
                q: 'Làm sao để đảm bảo đồ chơi an toàn cho trẻ?',
                a: 'Tất cả đồ chơi đều được kiểm duyệt kỹ lưỡng. Chúng tôi kiểm tra chất lượng, xuất xứ và độ an toàn trước khi cho phép chia sẻ.'
              },
              {
                q: 'Nếu đồ chơi bị hư hỏng trong quá trình mượn?',
                a: 'Chúng tôi có chính sách bảo hiểm đồ chơi. Mọi thiệt hại sẽ được xử lý công bằng giữa hai bên.'
              },
              {
                q: 'Tôi có thể mượn đồ chơi trong bao lâu?',
                a: 'Thời gian mượn tùy thuộc vào thỏa thuận giữa bạn và người cho mượn, thông thường từ 3-7 ngày.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.q}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng bắt đầu? 🚀
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Tham gia ngay hôm nay và khám phá thế giới đồ chơi tuyệt vời!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-500 font-semibold rounded-2xl hover:bg-gray-100 transition-all">
              <span>📝</span>
              <span>Đăng ký ngay</span>
            </a>
            <a href="/toys" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-blue-500 transition-all">
              <span>🧸</span>
              <span>Khám phá đồ chơi</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks