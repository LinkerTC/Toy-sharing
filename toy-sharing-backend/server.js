const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose"); // Thêm mongoose
const { initializeSocketRoutes } = require("./routes/socketRoutes");

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize socket routes
initializeSocketRoutes(io);

// Middleware
app.use(cors());
app.use(express.json());

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

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user to their room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Handle toy requests/notifications
  socket.on("toy-request", (data) => {
    // Emit to toy owner
    socket.to(data.ownerId).emit("new-request", {
      message: `${data.requesterName} muốn mượn ${data.toyName}`,
      toyId: data.toyId,
      requesterId: data.requesterId,
    });
  });

  // Handle chat messages
  socket.on("send-message", (data) => {
    socket.to(data.receiverId).emit("receive-message", {
      message: data.message,
      senderId: data.senderId,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible in routes
app.set("io", io);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/toys", require("./routes/toys"));
app.use("/api/favorites", require("./routes/favorite"));

const PORT = process.env.PORT || 5000;

// Start server only after database connection
mongoose.connection.once("open", () => {
  server.listen(PORT, () => {
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
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      console.log("💤 Process terminated");
      process.exit(0);
    });
  });
});
