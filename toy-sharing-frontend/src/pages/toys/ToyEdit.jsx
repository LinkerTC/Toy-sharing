// pages/toys/ToyEdit.jsx
import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'

const ToyEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { notifySuccess, notifyError } = useNotifications()

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',        // ObjectId
    condition: '',
    ageGroup: '',
    images: [''],
    price: '',
    pickupAddress: '',
    ownerNotes: '',
  })
  const [error, setError] = useState('')

  // Options
  const conditions = useMemo(() => ([
    { value: 'new', label: 'Mới' },
    { value: 'like-new', label: 'Như mới' },
    { value: 'good', label: 'Tốt' },
    { value: 'fair', label: 'Ổn' },
  ]), [])

  const ageGroups = useMemo(() => ([
    { value: '0-2', label: '0-2 tuổi' },
    { value: '3-5', label: '3-5 tuổi' },
    { value: '6-8', label: '6-8 tuổi' },
    { value: '9-12', label: '9-12 tuổi' },
    { value: '13-15', label: '13-15 tuổi' },
  ]), [])

  // Helpers
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  })

  // Load categories + toy in parallel
  useEffect(() => {
    let aborted = false
    const controller = new AbortController()

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        // 1) Categories
        const catRes = await fetch('http://localhost:3000/api/toys/categories', {
          signal: controller.signal,
          headers: getAuthHeaders(),
        })
        const catJson = await catRes.json()
        if (!catRes.ok) throw new Error(catJson?.error?.message || 'Không thể tải danh mục')
        const cats = catJson?.data?.categories || []
        if (!aborted) setCategories(cats)

        // 2) Toy detail
        const res = await fetch(`http://localhost:3000/api/toys/${id}`, {
          signal: controller.signal,
          headers: getAuthHeaders(),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error?.message || 'Không thể tải đồ chơi')

        const toy = json?.data?.toy
        if (!toy) throw new Error('Không tìm thấy đồ chơi')

        // Normalize fields -> formData
        const catId = typeof toy.category === 'object' ? toy.category?._id : toy.category
        const payload = {
          name: toy.name || '',
          description: toy.description || '',
          category: catId || '',
          condition: toy.condition || '',
          ageGroup: toy.ageGroup || '',
          images: Array.isArray(toy.images) && toy.images.length ? toy.images : [''],
          price: toy.price ?? '',
          pickupAddress: toy.pickupAddress || '',
          ownerNotes: toy.ownerNotes || '',
        }
        if (!aborted) setFormData(payload)
      } catch (e) {
        if (!aborted) {
          setError(e.message || 'Đã có lỗi xảy ra')
        }
      } finally {
        if (!aborted) setLoading(false)
      }
    }

    if (token) load()
    return () => {
      aborted = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((u, i) => (i === index ? value : u)),
    }))
  }

  const addImage = () => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))
  const removeImage = (index) =>
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))

  const validate = () => {
    if (!formData.name.trim()) return 'Tên đồ chơi là bắt buộc'
    if (!formData.description.trim()) return 'Mô tả là bắt buộc'
    if (!formData.category) return 'Danh mục là bắt buộc'
    if (!formData.condition) return 'Tình trạng là bắt buộc'
    if (!formData.ageGroup) return 'Độ tuổi phù hợp là bắt buộc'
    if (formData.price === '' || Number(formData.price) < 0) return 'Giá không hợp lệ'
    if (!formData.pickupAddress.trim()) return 'Địa chỉ nhận đồ là bắt buộc'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const msg = validate()
    if (msg) {
      notifyError('Dữ liệu chưa hợp lệ', msg)
      return
    }

    setIsSubmitting(true)
    try {
      const body = {
        name: formData.name,
        description: formData.description,
        category: formData.category,          // ObjectId
        condition: formData.condition,
        ageGroup: formData.ageGroup,          // '0-2', ...
        images: formData.images.filter(Boolean),
        price: Number(formData.price),
        pickupAddress: formData.pickupAddress,
        ownerNotes: formData.ownerNotes || undefined,
      }

      const res = await fetch(`http://localhost:3000/api/toys/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Cập nhật thất bại')

      notifySuccess('Cập nhật thành công', 'Đồ chơi đã được cập nhật 🎉')
      setTimeout(() => navigate('/my-toys', { replace: true }), 500)
    } catch (err) {
      notifyError('Cập nhật thất bại', err.message || 'Vui lòng thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đồ chơi...</p>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/my-toys')}
            className="px-5 py-2 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600"
          >
            Về danh sách đồ chơi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">✏️ Chỉnh sửa đồ chơi</h1>
          <p className="text-gray-600">Cập nhật thông tin đồ chơi của bạn</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">Tên đồ chơi</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                disabled={isSubmitting}
              />
            </div>

            {/* Selects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-medium mb-2 text-gray-700">Danh mục</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                  disabled={isSubmitting}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon ? `${cat.icon} ` : ''}{cat.displayName || cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-700">Tình trạng</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                  disabled={isSubmitting}
                >
                  <option value="">Chọn tình trạng</option>
                  {conditions.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-700">Độ tuổi</label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                  disabled={isSubmitting}
                >
                  <option value="">Chọn độ tuổi</option>
                  {ageGroups.map(a => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price + Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2 text-gray-700">Giá mượn (VND)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-gray-700">Địa chỉ nhận đồ</label>
                <input
                  type="text"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">Hình ảnh</label>
              {formData.images.map((url, idx) => (
                <div key={idx} className="flex gap-3 mb-3">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleArrayChange(idx, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                    placeholder="https://example.com/image.jpg"
                    disabled={isSubmitting}
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
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
                onClick={addImage}
                className="text-pink-500 hover:text-pink-600 font-medium"
                disabled={isSubmitting}
              >
                ➕ Thêm ảnh
              </button>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">Ghi chú</label>
              <textarea
                name="ownerNotes"
                rows={3}
                value={formData.ownerNotes}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                placeholder="Ghi chú thêm (không bắt buộc)"
                disabled={isSubmitting}
              />
            </div>

            {/* Actions */}
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
                {isSubmitting ? 'Đang cập nhật...' : '💾 Cập nhật'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ToyEdit
