import { useState, useEffect } from 'react'
import { useCreateBooking } from '@/hooks/useBookings'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const BookingForm = ({ toy, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth()
  const createBooking = useCreateBooking()

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    message: '',
    paymentMethod: 'cash'
  })
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [errors, setErrors] = useState({})

  // Set minimum start date to tomorrow
  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]
    
    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0]
    
    setFormData(prev => ({ 
      ...prev, 
      startDate: tomorrowStr,
      endDate: dayAfterTomorrowStr
    }))
  }, [])

  // Calculate number of days and total price
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // Include both start and end dates
    return Math.max(0, diffDays)
  }

  const days = calculateDays()
  const totalPrice = toy ? (toy.price || 0) * days : 0

  // Payment methods
  const paymentMethods = [
    { value: 'cash', label: 'Tiền mặt', icon: '💵' },
    { value: 'bank_transfer', label: 'Chuyển khoản', icon: '🏦' },
    { value: 'momo', label: 'MoMo', icon: '📱' },
    { value: 'zalopay', label: 'ZaloPay', icon: '💳' }
  ]

  // Update end date when start date changes
  const handleStartDateChange = (newStartDate) => {
    setFormData(prev => {
      const start = new Date(newStartDate)
      const currentEnd = prev.endDate ? new Date(prev.endDate) : null
      
      // If end date is before or same as new start date, set end date to start + 1 day
      if (!currentEnd || currentEnd <= start) {
        const newEnd = new Date(start)
        newEnd.setDate(start.getDate() + 1)
        return {
          ...prev,
          startDate: newStartDate,
          endDate: newEnd.toISOString().split('T')[0]
        }
      }
      
      return { ...prev, startDate: newStartDate }
    })
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu'
    } else {
      const startDate = new Date(formData.startDate)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      if (startDate < tomorrow) {
        newErrors.startDate = 'Ngày bắt đầu phải từ ngày mai trở đi'
      }
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc'
    } else if (formData.startDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      
      if (endDate <= startDate) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu'
      }
      
      // Check if booking period is too long (max 30 days)
      const diffTime = endDate.getTime() - startDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      if (diffDays > 30) {
        newErrors.endDate = 'Thời gian mượn tối đa 30 ngày'
      }
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const simulatePayment = async (paymentData) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    
    return {
      success: true,
      transactionId,
      amount: paymentData.amount,
      method: paymentData.method,
      status: 'paid',
      paidAt: new Date().toISOString()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (!user) {
      toast.error('Vui lòng đăng nhập để đặt mượn')
      return
    }

    if (!toy) {
      toast.error('Thông tin đồ chơi không hợp lệ')
      return
    }

    setIsProcessingPayment(true)

    try {
      // Process payment first
      const paymentData = {
        amount: totalPrice,
        method: formData.paymentMethod
      }

      const paymentResult = await simulatePayment(paymentData)

      if (!paymentResult.success) {
        throw new Error('Thanh toán thất bại')
      }

      // Create booking with payment info
      const bookingData = {
        toyId: toy._id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        borrowerMessage: formData.message,
        paymentInfo: {
          amount: paymentResult.amount,
          method: paymentResult.method,
          transactionId: paymentResult.transactionId,
          status: paymentResult.status,
          paidAt: paymentResult.paidAt
        }
      }

      await createBooking.mutateAsync(bookingData)

      toast.success('Thanh toán và đặt mượn thành công! 🎉', {
        duration: 4000
      })

      // Reset form
      setFormData({
        startDate: '',
        endDate: '',
        message: '',
        paymentMethod: 'cash'
      })

      onSuccess?.()
      onClose()

    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi đặt mượn')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  if (!isOpen || !toy) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">📅 Đặt mượn đồ chơi</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={isProcessingPayment}
            >
              ×
            </button>
          </div>

          {/* Toy Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🧸</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{toy.name}</h3>
                <p className="text-sm text-gray-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(toy.price || 0)}/ngày
                </p>
                <p className="text-xs text-gray-500">📍 {toy.pickupAddress}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Range Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                  className="w-full form-input"
                  disabled={isProcessingPayment}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={formData.startDate ? new Date(new Date(formData.startDate).getTime() + 86400000).toISOString().split('T')[0] : new Date(Date.now() + 172800000).toISOString().split('T')[0]} // Day after start date
                  className="w-full form-input"
                  disabled={isProcessingPayment}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>

            {/* Duration Display */}
            {days > 0 && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-blue-700 font-medium">
                    📅 Thời gian mượn: {days} ngày
                  </span>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Phương thức thanh toán
              </label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center space-x-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                      formData.paymentMethod === method.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="sr-only"
                      disabled={isProcessingPayment}
                    />
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lời nhắn cho chủ sở hữu (tùy chọn)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Ví dụ: Xin chào, tôi muốn mượn đồ chơi này cho con tôi..."
                rows={3}
                className="w-full form-input"
                disabled={isProcessingPayment}
              />
            </div>

            {/* Total Price */}
            <div className="bg-primary-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tổng tiền:</span>
                <span className="text-xl font-bold text-primary-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {toy.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(toy.price) : '0 ₫'} × {days} ngày
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessingPayment || createBooking.isLoading}
              className="w-full btn btn-primary btn-lg"
            >
              {isProcessingPayment ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý thanh toán...</span>
                </div>
              ) : (
                '💳 Thanh toán và đặt mượn'
              )}
            </button>
          </form>

          {/* Payment Info */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              💡 <strong>Lưu ý:</strong> Sau khi thanh toán thành công, đồ chơi sẽ chuyển sang trạng thái "đang mượn" 
              và bạn có thể liên hệ với chủ sở hữu để thỏa thuận giao nhận.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm