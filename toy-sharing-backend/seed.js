const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const Category = require("./models/Category");

// Categories mặc định
const defaultCategories = [
  {
    name: "educational",
    displayName: "Đồ chơi giáo dục",
    description: "Đồ chơi phát triển trí tuệ, kỹ năng học tập",
    icon: "📚",
  },
  {
    name: "construction",
    displayName: "Đồ chơi xây dựng",
    description: "Lego, blocks, đồ chơi xây dựng sáng tạo",
    icon: "🧱",
  },
  {
    name: "dolls",
    displayName: "Búp bê & Thú nhồi bông",
    description: "Búp bê, gấu bông, đồ chơi mềm",
    icon: "🧸",
  },
  {
    name: "vehicles",
    displayName: "Phương tiện & Xe đồ chơi",
    description: "Ô tô, xe máy, tàu hỏa, máy bay đồ chơi",
    icon: "🚗",
  },
  {
    name: "sports",
    displayName: "Đồ chơi thể thao",
    description: "Bóng, vợt, đồ chơi vận động ngoài trời",
    icon: "⚽",
  },
  {
    name: "arts_crafts",
    displayName: "Nghệ thuật & Thủ công",
    description: "Bút màu, giấy, đồ dùng vẽ vời, làm thủ công",
    icon: "🎨",
  },
  {
    name: "electronic",
    displayName: "Đồ chơi điện tử",
    description: "Robot, đồ chơi có pin, thiết bị điện tử",
    icon: "🤖",
  },
  {
    name: "other",
    displayName: "Khác",
    description: "Các loại đồ chơi khác",
    icon: "🎮",
  },
];

const seedCategories = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Xóa categories cũ
    await Category.deleteMany({});
    console.log("🗑️ Cleared existing categories");

    // Tạo categories mới
    await Category.insertMany(defaultCategories);
    console.log("✅ Seeded default categories");

    console.log("🎉 Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedCategories();
