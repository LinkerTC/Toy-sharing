import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { favoriteService } from "../../services/favorite";

const Toys = () => {
  const [searchParams] = useSearchParams();
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    condition: "",
    ageGroup: "",
    sortBy: "newest",
  });

  // State lưu danh sách id đồ chơi đã yêu thích
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const categories = {
    educational: { label: "Giáo dục", icon: "📚" },
    construction: { label: "Xây dựng", icon: "🧱" },
    dolls: { label: "Búp bê", icon: "🧸" },
    vehicles: { label: "Xe đồ chơi", icon: "🚗" },
    sports: { label: "Thể thao", icon: "⚽" },
    arts: { label: "Nghệ thuật", icon: "🎨" },
    electronic: { label: "Điện tử", icon: "🤖" },
    other: { label: "Khác", icon: "🎮" },
  };

  useEffect(() => {
    const loadToys = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/toys");
      const result = await response.json();
      console.log(result);
      setToys(result.data.toys); // 👈 Lấy mảng toys bên trong
      setLoading(false);
    };
    loadToys();
  }, [filters]);

  // Load favorites khi component mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setFavoritesLoading(true);
        const response = await favoriteService.getFavorites();
        if (response) {
          const favoriteIds = response.map((fav) => fav.toy.id);
          setFavoriteIds(favoriteIds);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setFavoritesLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Hàm xử lý khi bấm nút yêu thích
  const handleFavorite = async (toyId) => {
    try {
      const isFavorited = favoriteIds.includes(toyId);
      if (isFavorited) {
        await favoriteService.removeFavorite(toyId);
        setFavoriteIds((prev) => prev.filter((id) => id !== toyId));
      } else {
        await favoriteService.addFavorite(toyId);
        setFavoriteIds((prev) => [...prev, toyId]);
      }
    } catch (error) {
      console.error("Error handling favorite:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container py-16">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải đồ chơi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧸 Khám phá đồ chơi
          </h1>
          <p className="text-xl text-gray-600">
            Tìm kiếm và chia sẻ những món đồ chơi tuyệt vời cho các bé
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm đồ chơi..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="form-input"
                />
              </div>

              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
                className="form-input lg:w-48"
              >
                <option value="">Tất cả danh mục</option>
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>

              <button className="btn btn-primary whitespace-nowrap">
                🔍 Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Toys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {toys.map((toy, index) => {
            const category = categories[toy.category];
            const isFavorited = favoriteIds.includes(toy.id ?? toy._id);

            return (
              <div
                key={toy.id ?? toy._id ?? `toy-${index}`}
                className="card-toy relative"
              >
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
                  <span className="text-6xl opacity-60">
                    {category ? category.icon : "🧸"}
                  </span>
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                    <span className="badge badge-success">🟢 Có sẵn</span>
                    {/* Favorite Button nằm dưới badge 'Có sẵn' */}
                    <button
                      onClick={() => handleFavorite(toy.id ?? toy._id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
                        isFavorited
                          ? "bg-red-500 text-white shadow-lg"
                          : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
                      }`}
                      aria-label="Yêu thích"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all ${
                          isFavorited ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {category && (
                      <span className="badge badge-primary">
                        {category.icon} {category.label}
                      </span>
                    )}
                    <span className="badge badge-success">Như mới</span>
                  </div>

                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {toy.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {toy.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {toy.owner?.profile?.firstName?.charAt(0) || "👤"}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {toy.owner?.profile?.firstName}{" "}
                        {toy.owner?.profile?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        ⭐ {toy.owner?.stats?.rating ?? 0}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    📍 {toy.location}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link
                      to={`/toys/${toy.id}`}
                      className="w-full btn btn-primary btn-sm"
                    >
                      👀 Xem chi tiết
                    </Link>
                    <button className="w-full btn btn-outline btn-sm">
                      📅 Đặt mượn
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {toys.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Không tìm thấy đồ chơi
            </h3>
            <p className="text-gray-600 mb-6">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toys;
