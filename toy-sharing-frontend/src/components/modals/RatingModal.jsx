import { useState } from 'react'
import { useRateBooking } from '@/hooks/useBookings'

const RatingModal = ({ isOpen, onClose, booking }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)
  
  const rateBooking = useRateBooking({
    onSuccess: () => {
      onClose()
      setRating(0)
      setComment('')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      return
    }

    await rateBooking.mutateAsync({
      id: booking._id || booking.id,
      score: rating,
      comment: comment.trim()
    })
  }

  const handleStarClick = (starRating) => {
    setRating(starRating)
  }

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  if (!isOpen || !booking) return null

  const displayRating = hoveredRating || rating

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              ⭐ Đánh giá đồ chơi
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* Toy Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🧸</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {booking.toy?.name || 'Đồ chơi'}
                </h3>
                <p className="text-sm text-gray-600">
                  Đã hoàn thành • {new Date(booking.endDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Đánh giá của bạn *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className={`text-3xl transition-all duration-200 hover:scale-110 ${
                    star <= displayRating 
                      ? 'text-yellow-400 drop-shadow-sm' 
                      : rating > 0 
                        ? 'text-gray-200 opacity-40' 
                        : 'text-gray-300 hover:text-yellow-200'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <div className="mt-2">
              {rating > 0 && (
                <p className="text-sm text-gray-600">
                  {rating === 1 && '😞 Rất không hài lòng'}
                  {rating === 2 && '😐 Không hài lòng'}
                  {rating === 3 && '😊 Bình thường'}
                  {rating === 4 && '😄 Hài lòng'}
                  {rating === 5 && '🤩 Rất hài lòng'}
                </p>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Nhận xét (tùy chọn)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về đồ chơi này..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="mt-2 text-right">
              <span className="text-xs text-gray-500">
                {comment.length}/500 ký tự
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={rating === 0 || rateBooking.isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rateBooking.isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi...</span>
                </div>
              ) : (
                '⭐ Gửi đánh giá'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RatingModal
