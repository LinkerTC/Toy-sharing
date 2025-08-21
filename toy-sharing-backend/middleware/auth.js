const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware xác thực JWT token
const auth = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: {
          code: "NO_TOKEN",
          message: "Không có token, quyền truy cập bị từ chối",
        },
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer '

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy user từ database
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "Token không hợp lệ",
          },
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: {
            code: "USER_INACTIVE",
            message: "Tài khoản đã bị vô hiệu hóa",
          },
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Token không hợp lệ",
        },
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// Middleware kiểm tra quyền owner của resource
const checkOwnership = (Model, resourceParam = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceParam];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            code: "RESOURCE_NOT_FOUND",
            message: "Không tìm thấy tài nguyên",
          },
        });
      }

      // Kiểm tra ownership
      if (resource.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Không có quyền truy cập",
          },
        });
      }

      // Add resource to request
      req.resource = resource;
      next();
    } catch (error) {
      console.error("Ownership check error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Lỗi server",
        },
      });
    }
  };
};

module.exports = { auth, checkOwnership };
