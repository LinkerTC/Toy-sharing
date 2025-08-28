const Favorite = require("../models/Favorite");
const Toy = require("../models/Toy");

// Sửa function addFavorite
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const toyId = req.params.toyId;

    const toy = await Toy.findById(toyId).populate("owner", "profile");
    if (!toy) return res.status(404).json({ message: "Toy không tồn tại" });

    const favorite = await Favorite.findOneAndUpdate(
      { user: userId, toy: toyId },
      { user: userId, toy: toyId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Thông báo cho chủ sở hữu đồ chơi (đã loại bỏ socket)

    res.status(201).json(favorite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Bỏ khỏi danh sách yêu thích
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const toyId = req.params.toyId;

    const result = await Favorite.findOneAndDelete({
      user: userId,
      toy: toyId,
    });
    if (!result)
      return res.status(404).json({ message: "Favorite không tồn tại" });

    res.json({ message: "Đã xóa khỏi danh sách yêu thích" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy toàn bộ danh sách yêu thích của user
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await Favorite.find({ user: userId }).populate("toy");
    res.json(favorites);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
