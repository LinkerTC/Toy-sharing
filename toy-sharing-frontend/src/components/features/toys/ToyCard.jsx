import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MapPin, Calendar, Star } from 'lucide-react'
import { clsx } from 'clsx'

import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { categoryHelpers, stringHelpers, dateHelpers } from '@/utils/helpers'
import { ROUTES } from '@/utils/constants'

const ToyCard = ({ toy, onFavorite, onBooking, className }) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { isAuthenticated, user } = useAuth()

  // Normalize category
  const rawCategory = toy?.category ?? null
  const categoryKey = (() => {
    if (!rawCategory) return 'other'
    if (typeof rawCategory === 'string') return rawCategory
    if (typeof rawCategory === 'object') {
      return rawCategory.name || rawCategory.displayName || 'other'
    }
    return 'other'
  })()

  const categoryInfo = categoryHelpers.getCategoryInfo(categoryKey)
  const catIcon =
    (rawCategory && typeof rawCategory === 'object' && rawCategory.icon) ||
    categoryInfo.icon ||
    '🧸'
  const categoryLabel =
    (rawCategory && typeof rawCategory === 'object' && (rawCategory.displayName || rawCategory.name)) ||
    categoryInfo.label ||
    'Danh mục'

  const conditionInfo = categoryHelpers.getConditionInfo(toy?.condition || 'fair')
  const ageGroupInfo = categoryHelpers.getAgeGroupInfo(toy?.ageGroup || '')

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(prev => !prev)
    onFavorite?.(toy._id, !isFavorited)
  }

  const handleBooking = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onBooking?.(toy)
  }

  const handleImageError = () => setImageError(true)

  const isOwner = !!(user?._id && toy?.owner?._id && String(user._id) === String(toy.owner._id))

  const formattedPrice = stringHelpers.formatCurrency
    ? stringHelpers.formatCurrency(Number(toy?.price || 0), 'VND')
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(toy?.price || 0))

  return (
    <Card
      variant="toy"
      padding="none"
      hover
      interactive
      // h-full để thẻ chiếm toàn bộ chiều cao ô lưới
      className={clsx("overflow-hidden h-full", className)}
    >
      {/* Dùng cột để canh đều: ảnh cố định tỉ lệ, nội dung grow, action dính đáy */}
      <Link to={ROUTES.TOY_DETAIL(toy._id)} className="flex h-full flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {!imageError && toy?.images?.length > 0 ? (
            <img
              src={toy.images[0]}
              alt={toy.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              <span className="text-6xl opacity-50">{catIcon}</span>
            </div>
          )}

          {/* Favorite */}
          {isAuthenticated && !isOwner && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className={clsx(
                "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm",
                isFavorited
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
              )}
            >
              <Heart className={clsx("w-4 h-4 transition-all", isFavorited && "fill-current")} />
            </motion.button>
          )}

          {/* Status */}
          <div className="absolute top-3 left-3">
            <Badge variant={toy.status === 'available' ? 'success' : 'warning'} size="small" animate>
              {toy.status === 'available' ? '🟢 Có sẵn' : '🟡 Đang mượn'}
            </Badge>
          </div>

          {/* Condition */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="default" size="small">
              {conditionInfo?.label || 'Tình trạng'}
            </Badge>
          </div>
        </div>

        {/* Body + Action: dùng flex-col và grow để đồng chiều cao */}
        <div className="flex flex-1 flex-col">
          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Category & Age */}
            <div className="flex items-center justify-between mb-2">
              <Badge variant="primary" size="small" icon={catIcon}>
                {categoryLabel}
              </Badge>
              {ageGroupInfo && (
                <Badge variant="accent" size="small" icon={ageGroupInfo.icon}>
                  {ageGroupInfo.label}
                </Badge>
              )}
            </div>

            {/* Name */}
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {toy.name}
            </h3>

            {/* Price */}
            <div className="text-pink-600 font-bold mb-2">
              {formattedPrice}
            </div>

            {/* Description (giới hạn 2 dòng để tránh làm cao không đều) */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {stringHelpers.truncate(toy.description, 120)}
            </p>

            {/* Owner */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {toy.owner?.profile?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {toy.owner?.profile?.firstName} {toy.owner?.profile?.lastName}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Star className="w-3 h-3 fill-current text-yellow-400" />
                  <span>{toy.owner?.stats?.rating || 5.0}</span>
                  <span>•</span>
                  <span>{toy.owner?.stats?.toysShared || 0} đồ chơi</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{toy.pickupAddress}</span>
            </div>

            {/* Created */}
            <div className="flex items-center text-xs text-gray-400 mt-auto">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{dateHelpers.formatRelativeTime(toy.createdAt)}</span>
            </div>
          </div>

          {/* Actions dính đáy thẻ */}
          <div className="px-4 pb-4">
            {!isAuthenticated ? (
              <Button
                onClick={() => (window.location.href = ROUTES.LOGIN)}
                variant="secondary"
                size="small"
                className="w-full"
              >
                Đăng nhập để mượn
              </Button>
            ) : isOwner ? (
              <div className="text-center text-sm text-gray-500">Đồ chơi của bạn</div>
            ) : (
              <Button
                onClick={handleBooking}
                size="small"
                className="w-full"
                disabled={toy.status !== 'available'}
              >
                {toy.status === 'available' ? '📅 Đặt mượn' : '⏳ Đang mượn'}
              </Button>
            )}
          </div>
        </div>
      </Link>
    </Card>
  )
}

export default ToyCard
