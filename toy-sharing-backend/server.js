const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

// Connect to database
connectDB();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Toy Sharing API Server is running!

📍 Environment: ${process.env.NODE_ENV || "development"}
🌐 Port: ${PORT}
📡 Local URL: http://localhost:${PORT}
🔗 Health check: http://localhost:${PORT}/health
📚 API Docs: http://localhost:${PORT}/

🎯 Available endpoints:
   • POST /api/auth/register - Đăng ký
   • POST /api/auth/login - Đăng nhập  
   • GET  /api/auth/me - Thông tin user
   • GET  /api/toys - Danh sách đồ chơi
   • POST /api/toys - Tạo đồ chơi
   • GET  /api/bookings - Danh sách booking
   • POST /api/bookings - Tạo booking

💡 Tip: Dùng Postman hoặc curl để test APIs
`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log("❌ Unhandled Rejection:", err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Exception:", err.message);
  console.log("Shutting down...");
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received");
  console.log("Shutting down gracefully");
  server.close(() => {
    console.log("💤 Process terminated");
    process.exit(0);
  });
});
