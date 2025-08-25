import { format, formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  TOY_CATEGORIES,
  AGE_GROUPS,
  TOY_CONDITIONS,
  BOOKING_STATUS,
} from "./constants";

// Date helpers
export const dateHelpers = {
  // Format date to Vietnamese
  formatDate: (date, pattern = "dd/MM/yyyy") => {
    if (!date) return "";
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return format(parsedDate, pattern, { locale: vi });
  },

  // Format relative time
  formatRelativeTime: (date) => {
    if (!date) return "";
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNow(parsedDate, { locale: vi, addSuffix: true });
  },

  // Format date range
  formatDateRange: (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = dateHelpers.formatDate(startDate, "dd/MM");
    const end = dateHelpers.formatDate(endDate, "dd/MM/yyyy");
    return `${start} - ${end}`;
  },

  // Check if date is in past
  isPastDate: (date) => {
    if (!date) return false;
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return parsedDate < new Date();
  },

  // Get days between dates
  getDaysBetween: (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start =
      typeof startDate === "string" ? parseISO(startDate) : startDate;
    const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  },
};

// String helpers
export const stringHelpers = {
  // Truncate text
  truncate: (text, maxLength = 100, suffix = "...") => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + suffix;
  },

  // Capitalize first letter
  capitalize: (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  // Slugify text
  slugify: (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  },

  // Format currency
  formatCurrency: (amount, currency = "VND") => {
    if (typeof amount !== "number") return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  },

  // Format number
  formatNumber: (number) => {
    if (typeof number !== "number") return "";
    return new Intl.NumberFormat("vi-VN").format(number);
  },
};

// Array helpers
export const arrayHelpers = {
  // Remove duplicates
  unique: (array) => {
    return [...new Set(array)];
  },

  // Group by key
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Sort by key
  sortBy: (array, key, order = "asc") => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (order === "desc") {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  },

  // Paginate array
  paginate: (array, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return array.slice(offset, offset + limit);
  },
};

// Validation helpers
export const validationHelpers = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation (Vietnamese)
  isValidPhone: (phone) => {
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    return phoneRegex.test(phone);
  },

  // Password strength
  getPasswordStrength: (password) => {
    if (!password) return { strength: 0, message: "Nhập mật khẩu" };

    let score = 0;
    let message = "";

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        message = "Rất yếu";
        break;
      case 2:
        message = "Yếu";
        break;
      case 3:
        message = "Trung bình";
        break;
      case 4:
        message = "Mạnh";
        break;
      case 5:
        message = "Rất mạnh";
        break;
    }

    return { strength: score, message };
  },

  // URL validation
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// utils/helpers.js

export const categoryHelpers = {
  getCategoryInfo: (key) => {
    // Phòng thủ: nhận object/undefined
    const normalized =
      typeof key === "string"
        ? key
        : (key && typeof key === "object" && (key.name || key.displayName)) ||
          "other";

    const upper =
      typeof normalized === "string" ? normalized.toUpperCase() : "OTHER";
    return TOY_CATEGORIES[upper] || TOY_CATEGORIES.OTHER;
  },

  getAgeGroupInfo: (key) => {
    if (!key) return null;
    return AGE_GROUPS[key] || null;
  },

  getConditionInfo: (key) => {
    const normalized = typeof key === "string" ? key : "";
    const upper = normalized ? normalized.toUpperCase() : "FAIR";
    return TOY_CONDITIONS[upper] || TOY_CONDITIONS.FAIR;
  },

  getBookingStatusInfo: (key) => {
    const normalized = typeof key === "string" ? key : "REQUESTED";
    const upper = normalized.toUpperCase();
    return BOOKING_STATUS[upper] || BOOKING_STATUS.REQUESTED;
  },
};

// File helpers
export const fileHelpers = {
  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Check if file is image
  isImage: (file) => {
    return file && file.type && file.type.startsWith("image/");
  },

  // Get file extension
  getFileExtension: (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  },
};

// URL helpers
export const urlHelpers = {
  // Build query string
  buildQueryString: (params) => {
    const query = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });

    return query.toString();
  },

  // Parse query string
  parseQueryString: (search) => {
    const params = new URLSearchParams(search);
    const result = {};

    for (const [key, value] of params) {
      result[key] = value;
    }

    return result;
  },
};

// Debounce helper
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle helper
export const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function executedFunction(...args) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        function () {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan)
      );
    }
  };
};

// Local storage helpers
export const storageHelpers = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};
