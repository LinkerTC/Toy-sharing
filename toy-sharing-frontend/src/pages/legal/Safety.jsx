const Safety = () => {
  const tips = [
    {
      category: 'Gặp gỡ an toàn',
      icon: '🤝',
      items: [
        'Gặp mặt tại nơi công cộng, đông người',
        'Đi cùng với bạn bè hoặc người thân',
        'Thông báo lịch hẹn cho người khác biết',
        'Tin tưởng trực giác của bạn',
        'Không gặp mặt tại nhà riêng lần đầu'
      ]
    },
    {
      category: 'Kiểm tra đồ chơi',
      icon: '🔍',
      items: [
        'Kiểm tra kỹ tình trạng trước khi nhận',
        'Đảm bảo đồ chơi sạch sẽ, vệ sinh',
        'Xác nhận không có bộ phận bị hỏng',
        'Kiểm tra nhãn mác và xuất xứ',
        'Từ chối đồ chơi không an toàn'
      ]
    },
    {
      category: 'Bảo vệ thông tin',
      icon: '🔒',
      items: [
        'Không chia sẻ thông tin cá nhân nhạy cảm',
        'Chỉ sử dụng hệ thống tin nhắn của app',
        'Không chuyển khoản trước khi nhận hàng',
        'Báo cáo hành vi đáng nghi',
        'Giữ bằng chứng giao dịch'
      ]
    }
  ]

  const emergencyContacts = [
    { name: 'Cảnh sát', number: '113', icon: '🚔' },
    { name: 'Cứu hỏa', number: '114', icon: '🚒' },
    { name: 'Cấp cứu', number: '115', icon: '🚑' },
    { name: 'Hỗ trợ Toy Sharing', number: '1900-123-456', icon: '📞' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛡️ An toàn và bảo mật
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hướng dẫn giúp bạn có trải nghiệm an toàn khi chia sẻ đồ chơi
          </p>
        </div>

        {/* Hero Message */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">🌟 An toàn của bạn là ưu tiên hàng đầu</h2>
          <p className="text-lg opacity-90">
            Toy Sharing cam kết tạo ra một môi trường an toàn và tin cậy cho tất cả thành viên
          </p>
        </div>

        {/* Safety Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{tip.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">{tip.category}</h3>
              </div>

              <ul className="space-y-3">
                {tip.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <span className="text-green-500 text-lg mt-0.5">✓</span>
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Red Flags */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-red-900 mb-6 text-center">
            🚩 Dấu hiệu cảnh báo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Yêu cầu chuyển tiền trước',
              'Từ chối gặp mặt trực tiếp',
              'Thông tin không nhất quán',
              'Giá quá rẻ so với thị trường',
              'Vội vã trong giao dịch',
              'Không cho xem đồ chơi trước',
              'Yêu cầu thông tin cá nhân',
              'Hành vi đe dọa hoặc ép buộc'
            ].map((flag, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <span className="text-red-800 font-medium">{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            🆘 Liên hệ khẩn cấp
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="text-4xl mb-3">{contact.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{contact.name}</h4>
                <a 
                  href={`tel:${contact.number}`} 
                  className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {contact.number}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Report */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">
            📢 Báo cáo vấn đề
          </h2>
          <p className="text-yellow-800 mb-6">
            Nếu bạn gặp phải tình huống không an toàn hoặc đáng nghi, hãy báo cáo ngay cho chúng tôi
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
              🚨 Báo cáo khẩn cấp
            </button>
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors">
              📝 Báo cáo thường
            </button>
            <a href="mailto:safety@toysharing.com" className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors">
              📧 Email hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Safety