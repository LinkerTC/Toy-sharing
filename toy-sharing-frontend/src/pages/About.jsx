import { Link } from 'react-router-dom'

const About = () => {
  const team = [
    { name: 'Nguyễn Văn A', role: 'CEO & Co-founder', avatar: '👨‍💼' },
    { name: 'Trần Thị B', role: 'CTO & Co-founder', avatar: '👩‍💻' },
    { name: 'Lê Văn C', role: 'Head of Safety', avatar: '🛡️' },
    { name: 'Phạm Thị D', role: 'Community Manager', avatar: '👥' }
  ]

  const stats = [
    { number: '10,000+', label: 'Đồ chơi', icon: '🧸' },
    { number: '5,000+', label: 'Phụ huynh', icon: '👨‍👩‍👧‍👦' },
    { number: '50,000+', label: 'Giao dịch', icon: '🤝' },
    { number: '4.9/5', label: 'Đánh giá', icon: '⭐' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Về chúng tôi 🌟
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Toy Sharing ra đời từ mong muốn mang lại niềm vui cho trẻ em Việt Nam 
            thông qua việc chia sẻ đồ chơi an toàn, chất lượng và ý nghĩa.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Sứ mệnh của chúng tôi 🎯
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Chúng tôi tin rằng mọi đứa trẻ đều xứng đáng có những món đồ chơi 
                tuyệt vời để phát triển và vui chơi. Thông qua nền tảng chia sẻ, 
                chúng tôi giúp các gia đình:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Tiết kiệm chi phí mua đồ chơi mới</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Tái sử dụng đồ chơi một cách bền vững</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Kết nối cộng đồng phụ huynh</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Đảm bảo an toàn cho trẻ em</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 text-center">
                <div className="text-8xl mb-4">🤝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Chia sẻ là yêu thương</h3>
                <p className="text-gray-600">
                  Mỗi đồ chơi được chia sẻ là một món quà ý nghĩa 
                  gửi tới những đứa trẻ khác
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Con số ấn tượng 📊
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Đội ngũ của chúng tôi 👥
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những con người đam mê và tận tâm vì sự phát triển của trẻ em
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all">
                <div className="text-5xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Tham gia cùng chúng tôi! 🎉
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Hãy cùng xây dựng một cộng đồng chia sẻ đồ chơi tuyệt vời
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-red-100 text-pink-500 font-semibold rounded-2xl hover:bg-gray-100 transition-all">
            <span>🚀</span>
            <span>Bắt đầu ngay</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About