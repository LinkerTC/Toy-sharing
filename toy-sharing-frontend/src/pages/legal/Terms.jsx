const Terms = () => {
  const sections = [
    {
      title: '1. Chấp nhận điều khoản',
      content: [
        'Khi sử dụng Toy Sharing, bạn đồng ý tuân thủ các điều khoản này',
        'Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ',
        'Chúng tôi có quyền thay đổi điều khoản bất cứ lúc nào',
        'Việc tiếp tục sử dụng sau khi thay đổi có nghĩa là bạn chấp nhận'
      ]
    },
    {
      title: '2. Tài khoản người dùng',
      content: [
        'Bạn phải đủ 18 tuổi hoặc có sự đồng ý của phụ huynh',
        'Cung cấp thông tin chính xác và cập nhật',
        'Bảo mật thông tin đăng nhập của bạn',
        'Chịu trách nhiệm về mọi hoạt động trên tài khoản',
        'Không được tạo nhiều tài khoản cho cùng một người'
      ]
    },
    {
      title: '3. Quy định về đồ chơi',
      content: [
        'Đồ chơi phải an toàn và phù hợp với trẻ em',
        'Không chứa chất độc hại hoặc nguy hiểm',
        'Mô tả chính xác tình trạng và độ tuổi phù hợp',
        'Không đăng đồ chơi giả mạo hoặc vi phạm bản quyền',
        'Toy Sharing có quyền gỡ bỏ đồ chơi không phù hợp'
      ]
    },
    {
      title: '4. Giao dịch và thanh toán',
      content: [
        'Giao dịch diễn ra trực tiếp giữa các thành viên',
        'Toy Sharing không chịu trách nhiệm về tranh chấp',
        'Phí dịch vụ (nếu có) sẽ được thông báo rõ ràng',
        'Không hoàn trả phí trong trường hợp hủy giao dịch',
        'Tuân thủ quy định về thuế và pháp lý địa phương'
      ]
    },
    {
      title: '5. Hành vi cấm',
      content: [
        'Đăng tải nội dung không phù hợp hoặc có hại',
        'Lừa đảo, gian lận hoặc vi phạm pháp luật',
        'Quấy rối, đe dọa hoặc xúc phạm người khác',
        'Spam hoặc gửi tin nhắn không mong muốn',
        'Sử dụng bot hoặc tự động hóa không được phép'
      ]
    },
    {
      title: '6. Trách nhiệm và miễn trách',
      content: [
        'Toy Sharing không chịu trách nhiệm về chất lượng đồ chơi',
        'Người dùng tự chịu trách nhiệm về an toàn khi gặp gỡ',
        'Không bảo đảm tính liên tục của dịch vụ',
        'Giới hạn trách nhiệm pháp lý theo quy định',
        'Không chịu trách nhiệm về thiệt hại gián tiếp'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📋 Điều khoản sử dụng
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ Toy Sharing
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Có hiệu lực từ: {new Date().toLocaleDateString('vi-VN')}
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">📄 Tóm tắt nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div className="flex items-start gap-2">
              <span>✅</span>
              <span className="text-sm">Chia sẻ đồ chơi an toàn, chất lượng</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✅</span>
              <span className="text-sm">Tôn trọng và lịch sự với nhau</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✅</span>
              <span className="text-sm">Mô tả trung thực về đồ chơi</span>
            </div>
            <div className="flex items-start gap-2">
              <span>✅</span>
              <span className="text-sm">Bảo vệ thông tin cá nhân</span>
            </div>
            <div className="flex items-start gap-2">
              <span>❌</span>
              <span className="text-sm">Không lừa đảo hay gian lận</span>
            </div>
            <div className="flex items-start gap-2">
              <span>❌</span>
              <span className="text-sm">Không đăng nội dung có hại</span>
            </div>
          </div>
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
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ?</h2>
          <p className="mb-6 opacity-90">
            Nếu bạn có câu hỏi về điều khoản sử dụng, đừng ngần ngại liên hệ!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@toysharing.com" className="bg-white text-blue-500 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              📧 support@toysharing.com
            </a>
            <a href="/how-it-works" className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors">
              📖 Hướng dẫn sử dụng
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms