const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const toyRoutes = require("./routes/toys");
const bookingRoutes = require("./routes/bookings");
const categoryRoutes = require("./routes/categories");
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
  max: 100, // limit each IP to 100 requests per windowMs
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

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Toy Sharing API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/toys", toyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/categories", categoryRoutes);
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

module.exports = app;
