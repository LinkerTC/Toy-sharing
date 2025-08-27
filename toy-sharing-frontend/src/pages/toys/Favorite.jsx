import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { favoriteService } from "../../services/favorite";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

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
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesData = await favoriteService.getFavorites();
      setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (toyId) => {
    try {
      await favoriteService.removeFavorite(toyId);
      setFavorites((prev) => prev.filter((fav) => fav?.toy?._id !== toyId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-16">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách yêu thích...</p>
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
            💝 Danh sách yêu thích
          </h1>
          <p className="text-xl text-gray-600">
            Những món đồ chơi bạn đã lưu để xem sau
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => {
              const toy = favorite.toy;
              const category = toy ? categories[toy.category] : undefined;

              return (
                <div key={favorite._id} className="card-toy relative">
                  {/* Image */}
                  <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
                    <span className="text-6xl opacity-60">
                      {category ? category.icon : "🧸"}
                    </span>
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                      <span className="badge badge-success">🟢 Có sẵn</span>
                      {/* Remove from favorites button */}
                      <button
                        onClick={() => handleRemoveFavorite(toy?._id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm bg-red-500 text-white shadow-lg hover:bg-red-600"
                        aria-label="Xóa khỏi yêu thích"
                      >
                        <Trash2 className="w-4 h-4" />
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
                      {toy?.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {toy?.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {toy?.owner?.profile?.firstName?.charAt(0) || "👤"}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {toy?.owner?.profile?.firstName}{" "}
                          {toy?.owner?.profile?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ⭐ {toy?.owner?.stats?.rating ?? 0}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      📍 {toy?.pickupAddress}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Link
                        to={`/toys/${toy?._id}`}
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
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Chưa có đồ chơi yêu thích
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy khám phá và thêm những món đồ chơi bạn thích vào danh sách
            </p>
            <Link to="/toys" className="btn btn-primary">
              🔍 Khám phá đồ chơi
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorite;
