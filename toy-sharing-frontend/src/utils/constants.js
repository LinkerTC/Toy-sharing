// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// App Configuration
export const APP_CONFIG = {
  NAME: "Toy Sharing",
  DESCRIPTION: "Nền tảng chia sẻ đồ chơi cho trẻ em",
  VERSION: "1.0.0",
  CONTACT_EMAIL: "support@toysharing.com",
  PHONE: "1900-TOY-SHARE",
};

// Routes
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  HOW_IT_WORKS: "/how-it-works",
  CHAT: "/chat",
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",

  // Toys
  TOYS: "/toys",
  TOY_DETAIL: (id) => `/toys/${id}`,
  TOY_CREATE: "/toys/create",
  TOY_EDIT: (id) => `/toys/${id}/edit`,
  MY_TOYS: "/my-toys",
  FAVORITES: "/favorites",

  // Bookings
  BOOKINGS: "/bookings",
  BOOKING_DETAIL: (id) => `/bookings/${id}`,

  // Profile
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  SETTINGS: "/settings",

  // Legal
  PRIVACY: "/privacy",
  TERMS: "/terms",
  SAFETY: "/safety",
};

// Toy Categories
export const TOY_CATEGORIES = {
  EDUCATIONAL: {
    key: "educational",
    label: "Đồ chơi giáo dục",
    description: "Đồ chơi phát triển trí tuệ, kỹ năng học tập",
    icon: "📚",
    color: "bg-blue-500",
    lightColor: "bg-blue-100",
  },
  CONSTRUCTION: {
    key: "construction",
    label: "Đồ chơi xây dựng",
    description: "Lego, blocks, đồ chơi xây dựng sáng tạo",
    icon: "🧱",
    color: "bg-orange-500",
    lightColor: "bg-orange-100",
  },
  DOLLS: {
    key: "dolls",
    label: "Búp bê & Thú nhồi bông",
    description: "Búp bê, gấu bông, đồ chơi mềm",
    icon: "🧸",
    color: "bg-pink-500",
    lightColor: "bg-pink-100",
  },
  VEHICLES: {
    key: "vehicles",
    label: "Phương tiện & Xe đồ chơi",
    description: "Ô tô, xe máy, tàu hỏa, máy bay đồ chơi",
    icon: "🚗",
    color: "bg-red-500",
    lightColor: "bg-red-100",
  },
  SPORTS: {
    key: "sports",
    label: "Đồ chơi thể thao",
    description: "Bóng, vợt, đồ chơi vận động ngoài trời",
    icon: "⚽",
    color: "bg-green-500",
    lightColor: "bg-green-100",
  },
  ARTS_CRAFTS: {
    key: "arts_crafts",
    label: "Nghệ thuật & Thủ công",
    description: "Bút màu, giấy, đồ dùng vẽ vời, làm thủ công",
    icon: "🎨",
    color: "bg-purple-500",
    lightColor: "bg-purple-100",
  },
  ELECTRONIC: {
    key: "electronic",
    label: "Đồ chơi điện tử",
    description: "Robot, đồ chơi có pin, thiết bị điện tử",
    icon: "🤖",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-100",
  },
  OTHER: {
    key: "other",
    label: "Khác",
    description: "Các loại đồ chơi khác",
    icon: "🎮",
    color: "bg-gray-500",
    lightColor: "bg-gray-100",
  },
};

// Age Groups
export const AGE_GROUPS = {
  "0-2": {
    key: "0-2",
    label: "0-2 tuổi",
    description: "Trẻ sơ sinh và trẻ nhỏ",
    icon: "🍼",
    color: "bg-yellow-500",
  },
  "3-5": {
    key: "3-5",
    label: "3-5 tuổi",
    description: "Trẻ mầm non",
    icon: "🎈",
    color: "bg-green-500",
  },
  "6-8": {
    key: "6-8",
    label: "6-8 tuổi",
    description: "Trẻ tiểu học",
    icon: "🎒",
    color: "bg-blue-500",
  },
  "9-12": {
    key: "9-12",
    label: "9-12 tuổi",
    description: "Trẻ lớn",
    icon: "⚡",
    color: "bg-purple-500",
  },
  "13-15": {
    key: "13-15",
    label: "13-15 tuổi",
    description: "Thiếu niên",
    icon: "🚀",
    color: "bg-red-500",
  },
};

// Toy Conditions
export const TOY_CONDITIONS = {
  NEW: {
    key: "new",
    label: "Mới",
    description: "Chưa sử dụng, còn nguyên hộp",
    color: "bg-green-500",
    textColor: "text-green-800",
    bgColor: "bg-green-100",
  },
  LIKE_NEW: {
    key: "like-new",
    label: "Như mới",
    description: "Sử dụng ít, không có dấu hiệu hư hỏng",
    color: "bg-blue-500",
    textColor: "text-blue-800",
    bgColor: "bg-blue-100",
  },
  GOOD: {
    key: "good",
    label: "Tốt",
    description: "Còn tốt, có thể có vài dấu hiệu sử dụng nhẹ",
    color: "bg-yellow-500",
    textColor: "text-yellow-800",
    bgColor: "bg-yellow-100",
  },
  FAIR: {
    key: "fair",
    label: "Ổn",
    description: "Có dấu hiệu sử dụng nhưng vẫn hoạt động tốt",
    color: "bg-orange-500",
    textColor: "text-orange-800",
    bgColor: "bg-orange-100",
  },
};

// Booking Status
export const BOOKING_STATUS = {
  REQUESTED: {
    key: "requested",
    label: "Đang chờ",
    description: "Yêu cầu mượn đã được gửi",
    color: "bg-yellow-500",
    textColor: "text-yellow-800",
    bgColor: "bg-yellow-100",
    icon: "⏳",
  },
  CONFIRMED: {
    key: "confirmed",
    label: "Đã xác nhận",
    description: "Chủ đồ chơi đã đồng ý",
    color: "bg-blue-500",
    textColor: "text-blue-800",
    bgColor: "bg-blue-100",
    icon: "✅",
  },
  COMPLETED: {
    key: "completed",
    label: "Hoàn thành",
    description: "Đã hoàn thành việc mượn và trả",
    color: "bg-green-500",
    textColor: "text-green-800",
    bgColor: "bg-green-100",
    icon: "🏆",
  },
  CANCELLED: {
    key: "cancelled",
    label: "Đã hủy",
    description: "Yêu cầu đã bị hủy",
    color: "bg-red-500",
    textColor: "text-red-800",
    bgColor: "bg-red-100",
    icon: "❌",
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  MAX_FILES: 5,
};

// Theme Settings
export const THEME = {
  MODES: {
    KID: "kid",
    PARENT: "parent",
    AUTO: "auto",
  },
  FONT_SIZES: {
    SMALL: "small",
    NORMAL: "normal",
    LARGE: "large",
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  THEME: "theme-settings",
  USER_PREFERENCES: "user-preferences",
  SEARCH_HISTORY: "search-history",
  FAVORITES: "favorites",
};

// Animation Settings
export const ANIMATION = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: "ease-in",
    EASE_OUT: "ease-out",
    EASE_IN_OUT: "ease-in-out",
  },
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  FORBIDDEN: "Bạn không có quyền thực hiện hành động này.",
  NOT_FOUND: "Không tìm thấy thông tin yêu cầu.",
  SERVER_ERROR: "Lỗi server. Vui lòng thử lại sau.",
  VALIDATION: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
  GENERIC: "Có lỗi xảy ra. Vui lòng thử lại.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Đăng nhập thành công!",
  REGISTER: "Đăng ký thành công!",
  LOGOUT: "Đăng xuất thành công!",
  TOY_CREATED: "Tạo đồ chơi thành công!",
  TOY_UPDATED: "Cập nhật đồ chơi thành công!",
  TOY_DELETED: "Xóa đồ chơi thành công!",
  BOOKING_CREATED: "Tạo booking thành công!",
  BOOKING_UPDATED: "Cập nhật booking thành công!",
  PROFILE_UPDATED: "Cập nhật profile thành công!",
};
