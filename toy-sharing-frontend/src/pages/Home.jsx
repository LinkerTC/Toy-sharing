import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  TrendingUp, 
  Users, 
  Shield, 
  Heart,
  Star,
  ArrowRight,
  Play
} from 'lucide-react'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import ToyCard from '@/components/features/toys/ToyCard'
import { Loading } from '@/components/ui/Spinner'
import { useToys } from '@/hooks/useToys'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { ROUTES, TOY_CATEGORIES } from '@/utils/constants'
import { stringHelpers } from '@/utils/helpers'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { isKidMode } = useTheme()

  // Load featured toys
  const { data: toysData, isLoading } = useToys({
    page: 1,
    limit: 8,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`${ROUTES.TOYS}?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      navigate(ROUTES.TOYS)
    }
  }

  const handleCategoryClick = (categoryKey) => {
    navigate(`${ROUTES.TOYS}?category=${categoryKey}`)
  }

  const stats = [
    { label: 'Đồ chơi', value: '1,000+', icon: '🧸', color: 'text-pink-600' },
    { label: 'Người dùng', value: '500+', icon: '👥', color: 'text-blue-600' },
    { label: 'Giao dịch', value: '2,000+', icon: '🤝', color: 'text-green-600' },
    { label: 'Đánh giá', value: '4.9/5', icon: '⭐', color: 'text-yellow-600' }
  ]

  const features = [
    {
      icon: '🔒',
      title: 'An toàn tuyệt đối',
      description: 'Tất cả đồ chơi được kiểm duyệt kỹ lưỡng để đảm bảo an toàn cho trẻ em'
    },
    {
      icon: '🎯',
      title: 'Phù hợp độ tuổi',
      description: 'Lọc theo độ tuổi và sở thích để tìm đồ chơi phù hợp nhất cho bé'
    },
    {
      icon: '🏠',
      title: 'Giao nhận tận nơi',
      description: 'Hỗ trợ giao nhận tại nhà hoặc địa điểm thuận tiện cho phụ huynh'
    },
    {
      icon: '💰',
      title: 'Tiết kiệm chi phí',
      description: 'Chia sẻ thay vì mua mới, giúp tiết kiệm chi phí mà vẫn đảm bảo chất lượng'
    }
  ]

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${
        isKidMode() 
          ? 'bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100' 
          : 'bg-gradient-to-br from-blue-50 via-white to-pink-50'
      }`}>

        {/* Floating Toys Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['🧸', '🚗', '🎨', '⚽', '🤖', '🎲'].map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl opacity-10"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 10 + index * 2,
                repeat: Infinity,
                delay: index * 0.5
              }}
              style={{
                left: `${10 + index * 15}%`,
                top: `${20 + index * 10}%`
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="relative container-custom py-20 lg:py-32">
          <div className="grid w-[90%] mx-auto lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Chia sẻ{' '}
                <span className={`${
                  isKidMode() 
                    ? 'text-gradient bg-gradient-to-r from-pink-500 to-purple-500' 
                    : 'text-blue-600'
                }`}>
                  niềm vui
                </span>
                <br />
                cùng{' '}
                <span className={`${
                  isKidMode()
                    ? 'text-gradient bg-gradient-to-r from-purple-500 to-blue-500'
                    : 'text-pink-600'
                }`}>
                  đồ chơi! 🧸
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Nền tảng chia sẻ đồ chơi an toàn, thú vị cho trẻ em. 
                Giúp các bé khám phá thế giới đồ chơi phong phú mà không tốn kém.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {isAuthenticated ? (
                  <>
                    <Button
                      size="large"
                      onClick={() => navigate(ROUTES.TOYS)}
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Khám phá đồ chơi
                    </Button>
                    <Button
                      variant="secondary"
                      size="large"
                      onClick={() => navigate(ROUTES.TOY_CREATE)}
                      rightIcon={<Heart className="w-5 h-5" />}
                    >
                      Chia sẻ đồ chơi
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="large"
                      onClick={() => navigate(ROUTES.REGISTER)}
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Đăng ký ngay
                    </Button>
                    <Button
                      variant="secondary"
                      size="large"
                      onClick={() => navigate(ROUTES.LOGIN)}
                    >
                      Đăng nhập
                    </Button>
                  </>
                )}
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-6">
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 border-2 border-white flex items-center justify-center text-white font-semibold text-sm"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">500+ phụ huynh tin tưởng</p>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-pink-200 to-blue-200 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    {['🧸', '🚗', '🎨', '⚽'].map((emoji, index) => (
                      <motion.div
                        key={index}
                        className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-4xl shadow-sm"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring" }}
                      >
                        {emoji}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-6">
              Tìm đồ chơi yêu thích 🔍
            </h2>

            <form onSubmit={handleSearch} className="relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đồ chơi... (vd: robot, búp bê, lego)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  Tìm kiếm
                </Button>
              </div>
            </form>

            {/* Popular Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {Object.values(TOY_CATEGORIES).slice(0, 8).map((category) => (
                <motion.button
                  key={category.key}
                  onClick={() => handleCategoryClick(category.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all group"
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </span>
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {category.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Toys Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Đồ chơi nổi bật ✨
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá những đồ chơi được chia sẻ nhiều nhất và được yêu thích bởi cộng đồng
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                </div>
              ))}
            </div>
          ) : toysData?.toys?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {toysData.toys.slice(0, 8).map((toy, index) => (
                  <motion.div
                    key={toy._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ToyCard toy={toy} />
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  size="large"
                  onClick={() => navigate(ROUTES.TOYS)}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Xem tất cả đồ chơi
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có đồ chơi nào
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy là người đầu tiên chia sẻ đồ chơi của bạn!
              </p>
              {isAuthenticated && (
                <Button onClick={() => navigate(ROUTES.TOY_CREATE)}>
                  Thêm đồ chơi
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn Toy Sharing? 🤔
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nền tảng được thiết kế đặc biệt cho phụ huynh và trẻ em Việt Nam
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover={true} className="text-center h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${
        isKidMode() 
          ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600'
      } text-white`}>
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Sẵn sàng bắt đầu? 🚀
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Tham gia cộng đồng phụ huynh và trẻ em đang chia sẻ niềm vui với hàng ngàn đồ chơi
            </p>

            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="large"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Đăng ký miễn phí
                </Button>
                <Button
                  variant="ghost"
                  size="large"
                  onClick={() => navigate(ROUTES.HOW_IT_WORKS)}
                  className="text-white border-white hover:bg-white hover:text-purple-600"
                >
                  Tìm hiểu thêm
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                size="large"
                onClick={() => navigate(ROUTES.TOY_CREATE)}
                rightIcon={<Heart className="w-5 h-5" />}
              >
                Chia sẻ đồ chơi ngay
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home