const Privacy = () => {
  const sections = [
    {
      title: '1. Thông tin chúng tôi thu thập',
      content: [
        'Thông tin cá nhân: Họ tên, email, số điện thoại, địa chỉ',
        'Thông tin đồ chơi: Hình ảnh, mô tả, tình trạng đồ chơi',
        'Thông tin hoạt động: Lịch sử mượn, đánh giá, tin nhắn',
        'Thông tin kỹ thuật: Địa chỉ IP, cookie, thiết bị sử dụng'
      ]
    },
    {
      title: '2. Cách chúng tôi sử dụng thông tin',
      content: [
        'Cung cấp và cải thiện dịch vụ chia sẻ đồ chơi',
        'Kết nối người cho mượn và người mượn',
        'Xử lý giao dịch và thanh toán',
        'Gửi thông báo về hoạt động tài khoản',
        'Đảm bảo an toàn và bảo mật nền tảng'
      ]
    },
    {
      title: '3. Chia sẻ thông tin với bên thứ ba',
      content: [
        'Chúng tôi không bán thông tin cá nhân cho bên thứ ba',
        'Có thể chia sẻ với đối tác dịch vụ (thanh toán, giao hàng)',
        'Tuân thủ yêu cầu pháp lý từ cơ quan có thẩm quyền',
        'Bảo vệ quyền lợi và an toàn của cộng đồng'
      ]
    },
    {
      title: '4. Bảo mật thông tin',
      content: [
        'Mã hóa dữ liệu khi truyền và lưu trữ',
        'Kiểm soát truy cập nghiêm ngặt',
        'Cập nhật bảo mật thường xuyên',
        'Đào tạo nhân viên về bảo mật thông tin'
      ]
    },
    {
      title: '5. Quyền của người dùng',
      content: [
        'Truy cập và xem thông tin cá nhân',
        'Cập nhật hoặc xóa thông tin không chính xác',
        'Yêu cầu xóa tài khoản và dữ liệu',
        'Từ chối nhận thông báo marketing',
        'Khiếu nại về việc xử lý dữ liệu'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔒 Chính sách bảo mật
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giới thiệu</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Tại Toy Sharing, chúng tôi hiểu rằng quyền riêng tư của bạn là vô cùng quan trọng. 
            Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và 
            bảo vệ thông tin cá nhân của bạn khi sử dụng dịch vụ của chúng tôi.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Bằng cách sử dụng Toy Sharing, bạn đồng ý với việc thu thập và sử dụng thông tin 
            theo chính sách này.
          </p>
        </div>

        {/* Main Content */}
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
            <ul className="space-y-3">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                  <span className="text-pink-500 text-lg mt-0.5">•</span>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Có câu hỏi về quyền riêng tư?</h2>
          <p className="mb-6 opacity-90">
            Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, 
            vui lòng liên hệ với chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:privacy@toysharing.com" className="bg-white text-pink-500 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              📧 privacy@toysharing.com
            </a>
            <a href="tel:1900123456" className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors">
              📞 1900-123-456
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy