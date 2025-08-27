const express = require("express");
const {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  returnToy,
  checkExpiredBookings,
  rateBooking,
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

// @route   PUT /api/bookings/:id/return
// @desc    Trả đồ chơi (hoàn thành booking)
// @access  Private (Borrower only)
router.put("/:id/return", validateObjectId("id"), returnToy);

// @route   POST /api/bookings/check-expired
// @desc    Kiểm tra và tự động trả các booking hết hạn
// @access  Private
router.post("/check-expired", checkExpiredBookings);

// @route   PUT /api/bookings/:id/rate
// @desc    Đánh giá booking đã hoàn thành
// @access  Private (Borrower only)
router.put("/:id/rate", validateObjectId("id"), rateBooking);

module.exports = router;
