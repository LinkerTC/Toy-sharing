import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const ToyEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    condition: '',
    ageGroup: '',
    location: ''
  })

  useEffect(() => {
    // Load toy data for editing
    const loadToy = async () => {
      setLoading(true)
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock data
        setFormData({
          name: 'Robot Transformer Optimus Prime',
          description: 'Robot biến hình cao cấp với thiết kế chi tiết...',
          category: 'electronic',
          condition: 'like-new',
          ageGroup: '6-8 tuổi',
          location: 'Quận 1, TP.HCM'
        })
      } catch (error) {
        alert('Không thể tải thông tin đồ chơi')
        navigate('/my-toys')
      }
      setLoading(false)
    }

    loadToy()
  }, [id, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Cập nhật thành công! 🎉')
      navigate('/my-toys')
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }

    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đồ chơi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ✏️ Chỉnh sửa đồ chơi
          </h1>
          <p className="text-gray-600">Cập nhật thông tin đồ chơi của bạn</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block font-medium mb-2 text-gray-700">Tên đồ chơi</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div>
                <label className="block font-medium mb-2 text-gray-700">Danh mục</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                  disabled={isSubmitting}
                >
                  <option value="electronic">🤖 Điện tử</option>
                  <option value="construction">🧱 Xây dựng</option>
                  <option value="dolls">🧸 Búp bê</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-700">Tình trạng</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData(prev => ({...prev, condition: e.target.value}))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                  disabled={isSubmitting}
                >
                  <option value="new">Mới</option>
                  <option value="like-new">Như mới</option>
                  <option value="good">Tốt</option>
                  <option value="fair">Ổn</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-700">Độ tuổi</label>
                <select
                  value={formData.ageGroup}
                  onChange={(e) => setFormData(prev => ({...prev, ageGroup: e.target.value}))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                  disabled={isSubmitting}
                >
                  <option value="0-2 tuổi">0-2 tuổi</option>
                  <option value="3-5 tuổi">3-5 tuổi</option>
                  <option value="6-8 tuổi">6-8 tuổi</option>
                  <option value="9-12 tuổi">9-12 tuổi</option>
                  <option value="13+ tuổi">13+ tuổi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">Khu vực</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                disabled={isSubmitting}
              />
            </div>

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