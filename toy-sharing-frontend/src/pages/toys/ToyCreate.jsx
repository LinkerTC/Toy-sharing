// pages/toys/ToyCreate.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toysService } from '@/services/toys'
import api from '@/services/api'
import { useNotifications } from '../../context/NotificationContext'

const ToyCreate = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { notifySuccess, notifyError } = useNotifications()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([]) // fetch từ backend
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',      // ObjectId
    condition: '',
    ageGroup: '',
    images: [''],
    price: '',         // NEW
    pickupAddress: user?.profile?.location || '', // backend cần pickupAddress
    ownerNotes: '',
  })
  const [errors, setErrors] = useState({})

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Có thể dùng toysService.getCategories() để đồng bộ service
        const { data } = await api.get('/toys/categories')
        setCategories(data?.data?.categories || [])
      } catch {
        notifyError('Tải danh mục thất bại', 'Không thể tải danh mục, vui lòng thử lại')
      }
    }
    fetchCategories()
  }, [notifyError])

  const conditions = {
    'new': 'Mới',
    'like-new': 'Như mới',
    'good': 'Tốt',
    'fair': 'Ổn'
  }

  // đúng format với backend
  const ageGroups = [
    { value: '0-2', label: '0-2 tuổi' },
    { value: '3-5', label: '3-5 tuổi' },
    { value: '6-8', label: '6-8 tuổi' },
    { value: '9-12', label: '9-12 tuổi' },
    { value: '13-15', label: '13-15 tuổi' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Tên đồ chơi là bắt buộc'
    if (!formData.description.trim()) newErrors.description = 'Mô tả là bắt buộc'
    if (!formData.category) newErrors.category = 'Danh mục là bắt buộc'
    if (!formData.condition) newErrors.condition = 'Tình trạng là bắt buộc'
    if (!formData.ageGroup) newErrors.ageGroup = 'Độ tuổi phù hợp là bắt buộc'
    if (formData.price === '' || Number(formData.price) < 0) newErrors.price = 'Giá không hợp lệ'
    if (!formData.pickupAddress.trim()) newErrors.pickupAddress = 'Địa chỉ nhận đồ là bắt buộc'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,        // ObjectId
        condition: formData.condition,
        ageGroup: formData.ageGroup,        // '0-2' ...
        images: formData.images.filter(Boolean),
        price: Number(formData.price),
        pickupAddress: formData.pickupAddress,
        ownerNotes: formData.ownerNotes || undefined,
      }

      await toysService.createToy(payload)

      // Thông báo thành công, rồi điều hướng
      notifySuccess('Tạo đồ chơi thành công', 'Đồ chơi đã được đăng')
      setTimeout(() => {
        navigate('/my-toys', { replace: true })
      }, 700)
    } catch {
      notifyError('Tạo đồ chơi thất bại', 'Vui lòng kiểm tra thông tin và thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">➕ Thêm đồ chơi mới</h1>
          <p className="text-gray-600">Chia sẻ đồ chơi của bạn với cộng đồng</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">📝 Thông tin cơ bản</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block font-medium mb-2 text-gray-700">
                    Tên đồ chơi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'}`}
                    placeholder="VD: Robot Transformer Optimus Prime" disabled={isSubmitting}
                  />
                  {errors.name && <div className="text-red-500 text-sm mt-2">{errors.name}</div>}
                </div>

                {/* Category (ObjectId) */}
                <div>
                  <label className="block font-medium mb-2 text-gray-700">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category" value={formData.category} onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.category ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.icon ? `${cat.icon} ` : ''}{cat.displayName || cat.name}
                      </option>
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
                    name="condition" value={formData.condition} onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.condition ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'}`}
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
                    name="ageGroup" value={formData.ageGroup} onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.ageGroup ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Chọn độ tuổi</option>
                    {ageGroups.map(a => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                  {errors.ageGroup && <div className="text-red-500 text-sm mt-2">{errors.ageGroup}</div>}
                </div>

                {/* Price NEW */}
                <div>
                  <label className="block font-medium mb-2 text-gray-700">
                    Giá mượn (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" min="0" step="1000"
                    name="price" value={formData.price} onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.price ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'}`}
                    placeholder="VD: 50000" disabled={isSubmitting}
                  />
                  {errors.price && <div className="text-red-500 text-sm mt-2">{errors.price}</div>}
                </div>

                {/* Pickup Address */}
                <div className="lg:col-span-2">
                  <label className="block font-medium mb-2 text-gray-700">
                    Địa chỉ nhận đồ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.pickupAddress ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'}`}
                    placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP.HCM" disabled={isSubmitting}
                  />
                  {errors.pickupAddress && <div className="text-red-500 text-sm mt-2">{errors.pickupAddress}</div>}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description" value={formData.description} onChange={handleChange} rows={5}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.description ? 'border-red-500' : 'border-gray-200 focus:border-pink-500'}`}
                placeholder="Mô tả chi tiết về đồ chơi, tình trạng, cách sử dụng..." disabled={isSubmitting}
              />
              {errors.description && <div className="text-red-500 text-sm mt-2">{errors.description}</div>}
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🖼️ Hình ảnh</h3>
              {formData.images.map((url, idx) => (
                <div key={idx} className="flex gap-3 mb-3">
                  <input
                    type="url" value={url}
                    onChange={(e) => handleArrayChange('images', idx, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                    placeholder="https://example.com/image.jpg" disabled={isSubmitting}
                  />
                  {formData.images.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('images', idx)}
                      className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors" disabled={isSubmitting}>
                      🗑️
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('images')}
                className="text-pink-500 hover:text-pink-600 font-medium" disabled={isSubmitting}>
                ➕ Thêm ảnh
              </button>
            </div>

            {/* Owner Notes */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">Ghi chú</label>
              <textarea
                name="ownerNotes" rows={3} value={formData.ownerNotes} onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                placeholder="Ghi chú thêm (không bắt buộc)" disabled={isSubmitting}
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button type="button" onClick={() => navigate('/my-toys')}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}>
                Hủy
              </button>
              <button type="submit"
                className="flex-1 px-6 py-4 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50"
                disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Đang đăng...
                  </>
                ) : '🚀 Đăng đồ chơi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ToyCreate
