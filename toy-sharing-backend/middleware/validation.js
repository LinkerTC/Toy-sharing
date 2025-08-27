const { body, validationResult, param, query } = require("express-validator");

// Middleware xử lý validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Dữ liệu không hợp lệ",
        details: errors.array().map((error) => ({
          field: error.path,
          message: error.msg,
          value: error.value,
        })),
      },
    });
  }

  next();
};

// Validation rules cho user registration
const validateRegistration = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

  body("profile.firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Tên phải có từ 1-50 ký tự"),

  body("profile.lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Họ phải có từ 1-50 ký tự"),

  body("profile.phone")
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage("Số điện thoại không hợp lệ"),

  body("profile.address")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Địa chỉ không được quá 200 ký tự"),

  handleValidationErrors,
];

// Validation rules cho login
const validateLogin = [
  body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail(),

  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"),

  handleValidationErrors,
];

// Validation rules cho toy creation
const validateToy = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Tên đồ chơi phải có từ 1-100 ký tự"),

  body("description")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Mô tả phải có từ 1-1000 ký tự"),

  // CHANGED: category là ObjectId
  body("category").isMongoId().withMessage("Category phải là ObjectId hợp lệ"),

  body("ageGroup")
    .isIn(["0-2", "3-5", "6-8", "9-12", "13-15"])
    .withMessage("Nhóm tuổi không hợp lệ"),

  body("condition")
    .isIn(["new", "like-new", "good", "fair"])
    .withMessage("Tình trạng không hợp lệ"),

  body("pickupAddress")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Địa chỉ nhận đồ phải có từ 1-200 ký tự"),

  body("images").optional().isArray().withMessage("Hình ảnh phải là một mảng"),

  body("images.*").optional().isURL().withMessage("URL hình ảnh không hợp lệ"),

  // NEW: price
  body("price")
    .exists()
    .withMessage("Giá là bắt buộc")
    .isNumeric()
    .withMessage("Giá phải là số")
    .custom((v) => Number(v) >= 0)
    .withMessage("Giá không được âm"),

  body("ownerNotes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Ghi chú không được quá 500 ký tự"),

  handleValidationErrors,
];

// Validation rules cho booking
const validateBooking = [
  body("toyId").isMongoId().withMessage("ID đồ chơi không hợp lệ"),

  body("startDate")
    .isISO8601()
    .withMessage("Ngày bắt đầu không hợp lệ")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Ngày bắt đầu phải trong tương lai");
      }
      return true;
    }),

  body("endDate")
    .isISO8601()
    .withMessage("Ngày kết thúc không hợp lệ")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("Ngày kết thúc phải sau ngày bắt đầu");
      }
      return true;
    }),

  body("borrowerMessage")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Tin nhắn không được quá 500 ký tự"),

  handleValidationErrors,
];

// Validation cho booking status update
const validateBookingStatus = [
  body("status")
    .isIn(["confirmed", "completed", "cancelled"])
    .withMessage("Trạng thái không hợp lệ"),

  body("lenderResponse")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Phản hồi không được quá 500 ký tự"),

  handleValidationErrors,
];

// Validation cho ObjectId parameters
const validateObjectId = (paramName = "id") => [
  param(paramName).isMongoId().withMessage(`${paramName} không hợp lệ`),

  handleValidationErrors,
];

// Validation cho query parameters
const validateQueryParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Trang phải là số nguyên dương"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Giới hạn phải từ 1-50"),

  // CHANGED: category là ObjectId
  query("category")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Category phải là chuỗi (name hoặc ObjectId)"),

  query("ageGroup")
    .optional()
    .isIn(["0-2", "3-5", "6-8", "9-12", "13-15"])
    .withMessage("Nhóm tuổi không hợp lệ"),

  // Optional: price range
  query("priceMin").optional().isNumeric().withMessage("priceMin phải là số"),
  query("priceMax").optional().isNumeric().withMessage("priceMax phải là số"),
  handleValidationErrors,
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateToy,
  validateBooking,
  validateBookingStatus,
  validateObjectId,
  validateQueryParams,
  handleValidationErrors,
};
