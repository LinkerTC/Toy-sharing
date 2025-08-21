import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

import { ROUTES, APP_CONFIG } from '@/utils/constants'
import { useTheme } from '@/context/ThemeContext'

const Footer = () => {
  const { isKidMode } = useTheme()

  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Về chúng tôi': [
      { label: 'Giới thiệu', path: ROUTES.ABOUT },
      { label: 'Hướng dẫn sử dụng', path: ROUTES.HOW_IT_WORKS },
      { label: 'An toàn', path: ROUTES.SAFETY }
    ],
    'Hỗ trợ': [
      { label: 'Liên hệ', path: '/contact' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Trợ giúp', path: '/help' }
    ],
    'Pháp lý': [
      { label: 'Điều khoản sử dụng', path: ROUTES.TERMS },
      { label: 'Chính sách bảo mật', path: ROUTES.PRIVACY },
      { label: 'Quy tắc cộng đồng', path: '/community-rules' }
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'YouTube', icon: '📺', url: '#' },
    { name: 'TikTok', icon: '🎵', url: '#' }
  ]

  return (
    <footer className={`border-t ${isKidMode() ? 'border-pink-200 bg-gradient-to-r from-pink-50 to-blue-50' : 'border-gray-200 bg-gray-50'}`}>
      <div className="container-custom">

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to={ROUTES.HOME} className="flex items-center space-x-2 mb-4">
                <motion.div
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  🧸
                </motion.div>
                <div>
                  <h3 className={`text-xl font-bold ${isKidMode() ? 'text-gradient bg-gradient-to-r from-primary-500 to-secondary-500' : 'text-gray-900'}`}>
                    Toy Sharing
                  </h3>
                  <p className="text-sm text-gray-500">Chia sẻ niềm vui</p>
                </div>
              </Link>

              <p className="text-gray-600 mb-4">
                Nền tảng chia sẻ đồ chơi an toàn, thú vị cho trẻ em và phụ huynh. 
                Giúp các bé khám phá thế giới đồ chơi phong phú mà không tốn kém.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{APP_CONFIG.CONTACT_EMAIL}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{APP_CONFIG.PHONE}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Hà Nội, Việt Nam</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-gray-600 hover:text-primary-600 transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">

            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>© {currentYear} Toy Sharing.</span>
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for kids</span>
              <span className="text-lg">👶</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 mr-2">Theo dõi chúng tôi:</span>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Version */}
            <div className="text-xs text-gray-400">
              v{APP_CONFIG.VERSION}
            </div>
          </div>
        </div>
      </div>

      {/* Fun Kid-Friendly Bottom Border */}
      {isKidMode() && (
        <div className="h-2 bg-gradient-to-r from-pink-400 via-purple-400 via-blue-400 via-green-400 via-yellow-400 to-red-400"></div>
      )}
    </footer>
  )
}

export default Footer