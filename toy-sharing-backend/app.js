const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const toyRoutes = require("./routes/toys");
const bookingRoutes = require("./routes/bookings");
const categoryRoutes = require("./routes/categories");
const favoriteRoutes = require("./routes/favorite");
const chatRoutes = require("./routes/chat");
const commentRoutes = require("./routes/comments");

const app = express();

// Trust proxy (for Heroku deployment)
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Quá nhiều requests, vui lòng thử lại sau 15 phút",
    },
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use("/api", limiter);

// Body parser middleware
app.use(
  express.json({
    limit: "10mb",
    type: "application/json",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Logging middleware (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/toy-sharing",
      {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      }
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🟡 Mongoose disconnected");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Toy Sharing API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    mongodb:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/toys", toyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/comments", commentRoutes);

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "ENDPOINT_NOT_FOUND",
      message: `API endpoint ${req.method} ${req.originalUrl} không tồn tại`,
    },
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Toy Sharing API",
    version: "1.0.0",
    documentation: "/api/docs",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      toys: "/api/toys",
      bookings: "/api/bookings",
      categories: "/api/categories",
      favorites: "/api/favorites",
      chat: "/api/chat",
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Tài nguyên không tìm thấy";
    error = {
      statusCode: 404,
      error: {
        code: "INVALID_ID",
        message,
      },
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Dữ liệu đã tồn tại";
    error = {
      statusCode: 400,
      error: {
        code: "DUPLICATE_DATA",
        message,
      },
    };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = {
      statusCode: 400,
      error: {
        code: "VALIDATION_ERROR",
        message,
      },
    };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = {
      statusCode: 401,
      error: {
        code: "INVALID_TOKEN",
        message: "Token không hợp lệ",
      },
    };
  }

  if (err.name === "TokenExpiredError") {
    error = {
      statusCode: 401,
      error: {
        code: "TOKEN_EXPIRED",
        message: "Token đã hết hạn",
      },
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.error || {
      code: "INTERNAL_SERVER_ERROR",
      message: "Lỗi server",
    },
  });
});

// Import Socket.IO service
const socketService = require("./services/socketService");

// Start server only after database connection
const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
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
   • POST /api/chat/send - Gửi tin nhắn
   • GET  /api/chat/conversations - Danh sách conversation
   • GET  /api/chat/conversation/:otherUserId - Lịch sử chat

💬 Chat Features:
   • Realtime messaging với Socket.IO
   • Lưu lịch sử tin nhắn
   • Typing indicators
   • Online/offline status

💡 Tip: Dùng Postman hoặc curl để test APIs
`);
  });

  // Initialize Socket.IO
  socketService.initialize(server);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log("❌ Unhandled Rejection:", err.message);
  process.exit(1);
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
  mongoose.connection.close(false, () => {
    console.log("MongoDB connection closed.");
    console.log("💤 Process terminated");
    process.exit(0);
  });
});

module.exports = app;
