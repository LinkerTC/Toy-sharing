import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ToyCreate = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    condition: '',
    ageGroup: '',
    images: [],
    features: [''],
    safetyNotes: [''],
    location: user?.profile?.location || ''
  })
  const [errors, setErrors] = useState({})

  const categories = {
    'educational': '📚 Giáo dục',
    'construction': '🧱 Xây dựng', 
    'dolls': '🧸 Búp bê',
    'vehicles': '🚗 Xe đồ chơi',
    'sports': '⚽ Thể thao',
    'arts': '🎨 Nghệ thuật',
    'electronic': '🤖 Điện tử',
    'other': '🎮 Khác'
  }

  const conditions = {
    'new': 'Mới',
    'like-new': 'Như mới',
    'good': 'Tốt',
    'fair': 'Ổn'
  }

  const ageGroups = [
    '0-2 tuổi', '3-5 tuổi', '6-8 tuổi', '9-12 tuổi', '13+ tuổi'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Tên đồ chơi là bắt buộc'
    if (!formData.description.trim()) newErrors.description = 'Mô tả là bắt buộc'
    if (!formData.category) newErrors.category = 'Danh mục là bắt buộc'
    if (!formData.condition) newErrors.condition = 'Tình trạng là bắt buộc'
    if (!formData.ageGroup) newErrors.ageGroup = 'Độ tuổi phù hợp là bắt buộc'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock success
      alert('Đồ chơi đã được đăng thành công! 🎉')
      navigate('/my-toys')
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ➕ Thêm đồ chơi mới
          </h1>
          <p className="text-gray-600">
            Chia sẻ đồ chơi của bạn với cộng đồng
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">📝 Thông tin cơ bản</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Name */}
                <div className="lg:col-span-2">
                  <label className="block font-medium mb-2 text-gray-700">
                    Tên đồ chơi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                      errors.name ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'
                    }`}
                    placeholder="VD: Robot Transformer Optimus Prime"
                    disabled={isSubmitting}
                  />
                  {errors.name && <div className="text-red-500 text-sm mt-2">{errors.name}</div>}
                </div>

                {/* Category */}
                <div>
                  <label className="block font-medium mb-2 text-gray-700">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                      errors.category ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Chọn danh mục</option>
                    {Object.entries(categories).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  {errors.category && <div className="text-red-500 text-sm mt-2">{errors.category}</div>}
                </div>

                {/* Condition */}
                <div>
                  <label className="block font-medium mb-2 text-gray-700">
                    Tình trạng <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                      errors.condition ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Chọn tình trạng</option>
                    {Object.entries(conditions).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  {errors.condition && <div className="text-red-500 text-sm mt-2">{errors.condition}</div>}
                </div>

                {/* Age Group */}
                <div>
                  <label className="block font-medium mb-2 text-gray-700">
                    Độ tuổi phù hợp <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                      errors.ageGroup ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Chọn độ tuổi</option>
                    {ageGroups.map((age) => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                  {errors.ageGroup && <div className="text-red-500 text-sm mt-2">{errors.ageGroup}</div>}
                </div>

                {/* Location */}
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Khu vực</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                    placeholder="VD: Quận 1, TP.HCM"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                  errors.description ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'
                }`}
                placeholder="Mô tả chi tiết về đồ chơi, tình trạng, cách sử dụng..."
                disabled={isSubmitting}
              />
              {errors.description && <div className="text-red-500 text-sm mt-2">{errors.description}</div>}
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ Đặc điểm nổi bật</h3>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleArrayChange('features', index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                    placeholder="VD: Chất liệu nhựa ABS an toàn"
                    disabled={isSubmitting}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('features', index)}
                      className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      disabled={isSubmitting}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('features')}
                className="text-pink-500 hover:text-pink-600 font-medium"
                disabled={isSubmitting}
              >
                ➕ Thêm đặc điểm
              </button>
            </div>

            {/* Safety Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Lưu ý an toàn</h3>
              {formData.safetyNotes.map((note, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => handleArrayChange('safetyNotes', index, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                    placeholder="VD: Không phù hợp cho trẻ dưới 3 tuổi"
                    disabled={isSubmitting}
                  />
                  {formData.safetyNotes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('safetyNotes', index)}
                      className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      disabled={isSubmitting}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('safetyNotes')}
                className="text-pink-500 hover:text-pink-600 font-medium"
                disabled={isSubmitting}
              >
                ➕ Thêm lưu ý
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/my-toys')}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-4 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Đang đăng...
                  </>
                ) : (
                  '🚀 Đăng đồ chơi'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ToyCreate