const express = require("express");
const {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
} = require("../controllers/bookingController");
const {
  validateBooking,
  validateBookingStatus,
  validateObjectId,
} = require("../middleware/validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Tất cả routes trong file này đều cần authentication
router.use(auth);

// @route   GET /api/bookings
// @desc    Lấy danh sách bookings của user
// @access  Private
router.get("/", getBookings);

// @route   GET /api/bookings/:id
// @desc    Lấy chi tiết một booking
// @access  Private
router.get("/:id", validateObjectId("id"), getBooking);

// @route   POST /api/bookings
// @desc    Tạo booking request mới
// @access  Private
router.post("/", validateBooking, createBooking);

// @route   PUT /api/bookings/:id/status
// @desc    Cập nhật trạng thái booking
// @access  Private (Lender only)
router.put(
  "/:id/status",
  validateObjectId("id"),
  validateBookingStatus,
  updateBookingStatus
);

module.exports = router;
