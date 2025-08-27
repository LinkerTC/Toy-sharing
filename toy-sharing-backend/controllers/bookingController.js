const Booking = require("../models/Booking");
const Toy = require("../models/Toy");
const User = require("../models/User");

// @desc    Lấy danh sách bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const {
      status,
      role, // 'borrower' | 'lender'
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    let query = {};

    if (role === "borrower") {
      query.borrower = req.user._id;
    } else if (role === "lender") {
      query.lender = req.user._id;
    } else {
      // Lấy cả bookings mà user là borrower và lender
      query.$or = [{ borrower: req.user._id }, { lender: req.user._id }];
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate("borrower", "profile")
      .populate("lender", "profile")
      .populate("toy", "name images category ageGroup pickupAddress");

    const total = await Booking.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// @desc    Lấy chi tiết một booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("borrower", "profile stats")
      .populate("lender", "profile stats")
      .populate(
        "toy",
        "name description images category ageGroup condition pickupAddress ownerNotes"
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          code: "BOOKING_NOT_FOUND",
          message: "Không tìm thấy booking",
        },
      });
    }

    // Kiểm tra quyền truy cập - chỉ borrower và lender mới được xem
    if (
      booking.borrower._id.toString() !== req.user._id.toString() &&
      booking.lender._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Không có quyền truy cập",
        },
      });
    }

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// @desc    Tạo booking request
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { toyId, startDate, endDate, borrowerMessage, paymentInfo } = req.body;

    // Kiểm tra toy có tồn tại và available
    const toy = await Toy.findOne({
      _id: toyId,
      isActive: true,
    });

    if (!toy) {
      return res.status(404).json({
        success: false,
        error: {
          code: "TOY_NOT_FOUND",
          message: "Không tìm thấy đồ chơi",
        },
      });
    }

    if (toy.status !== "available") {
      return res.status(400).json({
        success: false,
        error: {
          code: "TOY_NOT_AVAILABLE",
          message: "Đồ chơi không khả dụng",
        },
      });
    }

    // Không thể mượn đồ chơi của chính mình
    if (toy.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: {
          code: "CANNOT_BORROW_OWN_TOY",
          message: "Không thể mượn đồ chơi của chính mình",
        },
      });
    }

    // Kiểm tra conflict với các booking khác
    const conflictingBooking = await Booking.findOne({
      toy: toyId,
      status: "confirmed", // Only check confirmed bookings since we skip requested status
      $or: [
        {
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        error: {
          code: "BOOKING_CONFLICT",
          message: "Đã có booking khác trong khoảng thời gian này",
        },
      });
    }

    // Validate payment info if provided
    if (paymentInfo) {
      if (!paymentInfo.amount || !paymentInfo.method || !paymentInfo.transactionId) {
        return res.status(400).json({
          success: false,
          error: {
            code: "INVALID_PAYMENT_INFO",
            message: "Thông tin thanh toán không đầy đủ",
          },
        });
      }
    }

    // Always create bookings in confirmed status (skip pending step)
    const initialStatus = 'confirmed';

    // Tạo booking mới
    const booking = await Booking.create({
      toy: toyId,
      borrower: req.user._id,
      lender: toy.owner,
      startDate,
      endDate,
      borrowerMessage,
      paymentInfo,
      status: initialStatus,
    });

    // Always update toy status to borrowed when booking is created
    await Toy.findByIdAndUpdate(toyId, { status: "borrowed" });

    // Populate để trả về đầy đủ thông tin
    await booking.populate([
      { path: "borrower", select: "profile" },
      { path: "lender", select: "profile" },
      { path: "toy", select: "name images category ageGroup pickupAddress" },
    ]);

    res.status(201).json({
      success: true,
      data: { booking },
      message: "Đặt mượn thành công! Bạn có thể bắt đầu sử dụng đồ chơi.",
    });
  } catch (error) {
    console.error("Create booking error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: messages.join(", "),
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// @desc    Cập nhật trạng thái booking
// @route   PUT /api/bookings/:id/status
// @access  Private (Lender only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, lenderResponse } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          code: "BOOKING_NOT_FOUND",
          message: "Không tìm thấy booking",
        },
      });
    }

    // // Chỉ lender mới có quyền cập nhật status
    // if (booking.borrower.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     error: {
    //       code: "FORBIDDEN",
    //       message: "Chỉ chủ đồ chơi mới có thể cập nhật trạng thái",
    //     },
    //   });
    // }

    // Validate status transitions
    const validTransitions = {
      confirmed: ["completed", "cancelled"],
      completed: [], // Cannot change from completed
      cancelled: [], // Cannot change from cancelled
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_STATUS_TRANSITION",
          message: `Không thể chuyển từ trạng thái ${booking.status} sang ${status}`,
        },
      });
    }

    // Cập nhật booking
    booking.status = status;
    if (lenderResponse) {
      booking.lenderResponse = lenderResponse;
    }
    await booking.save();

    // Cập nhật trạng thái toy
    if (status === "confirmed") {
      await Toy.findByIdAndUpdate(booking.toy, { status: "borrowed" });
    } else if (status === "completed" || status === "cancelled") {
      await Toy.findByIdAndUpdate(booking.toy, { status: "available" });

      // Cập nhật stats nếu completed
      if (status === "completed") {
        await User.findByIdAndUpdate(booking.borrower, {
          $inc: { "stats.toysBorrowed": 1 },
        });
      }
    }

    // Populate và trả về
    await booking.populate([
      { path: "borrower", select: "profile" },
      { path: "lender", select: "profile" },
      { path: "toy", select: "name images category" },
    ]);

    res.status(200).json({
      success: true,
      data: { booking },
      message: `Cập nhật trạng thái thành ${status} thành công`,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: messages.join(", "),
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// @desc    Return toy (complete booking)
// @route   PUT /api/bookings/:id/return
// @access  Private (Borrower only)
const returnToy = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          code: "BOOKING_NOT_FOUND",
          message: "Không tìm thấy booking",
        },
      });
    }
    console.log("Booking found:", booking);
    console.log("User ID:", req.user._id.toString());
    console.log("Booking borrower ID:", booking.borrower.toString());
    // Chỉ borrower mới có thể trả đồ chơi
    if (booking.borrower._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Chỉ người mượn mới có thể trả đồ chơi",
        },
      });
    }

    // Chỉ có thể trả đồ chơi đang được mượn
    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_STATUS",
          message: "Chỉ có thể trả đồ chơi đang được mượn",
        },
      });
    }

    // Cập nhật booking status và toy status
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      {
        status: "completed",
        returnedAt: new Date()
      },
      { new: true }
    ).populate([
      { path: "borrower", select: "profile" },
      { path: "lender", select: "profile" },
      { path: "toy", select: "name images category" },
    ]);

    await Toy.findByIdAndUpdate(booking.toy, { status: "available" });

    // Cập nhật stats
    await User.findByIdAndUpdate(booking.borrower, {
      $inc: { "stats.toysBorrowed": 1 },
    });

    res.status(200).json({
      success: true,
      data: { booking: updatedBooking },
      message: "Trả đồ chơi thành công",
    });
  } catch (error) {
    console.error("Return toy error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// @desc    Check and auto-return expired bookings
// @route   POST /api/bookings/check-expired
// @access  Private
const checkExpiredBookings = async (req, res) => {
  try {
    const now = new Date();
    
    // Find all confirmed bookings that have passed their end date
    const expiredBookings = await Booking.find({
      status: "confirmed",
      endDate: { $lt: now }
    }).populate("toy", "name");

    let autoReturnedCount = 0;
    const autoReturnedBookings = [];

    // Auto-return each expired booking
    for (const booking of expiredBookings) {
      await Booking.findByIdAndUpdate(booking._id, {
        status: "completed",
        returnedAt: new Date(),
        autoReturned: true
      });

      // Update toy status back to available
      await Toy.findByIdAndUpdate(booking.toy._id, { status: "available" });

      // Update borrower stats
      await User.findByIdAndUpdate(booking.borrower, {
        $inc: { "stats.toysBorrowed": 1 },
      });

      autoReturnedCount++;
      autoReturnedBookings.push({
        id: booking._id,
        toyName: booking.toy.name,
        endDate: booking.endDate
      });
    }

    res.status(200).json({
      success: true,
      data: {
        autoReturnedCount,
        autoReturnedBookings
      },
      message: `Đã tự động trả ${autoReturnedCount} đồ chơi hết hạn`,
    });
  } catch (error) {
    console.error("Check expired bookings error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

// @desc    Rate a completed booking
// @route   PUT /api/bookings/:id/rate
// @access  Private (Borrower only)
const rateBooking = async (req, res) => {
  try {
    const { score, comment } = req.body;

    // Validate rating score
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_RATING",
          message: "Điểm đánh giá phải từ 1 đến 5",
        },
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          code: "BOOKING_NOT_FOUND",
          message: "Không tìm thấy booking",
        },
      });
    }

    // Chỉ borrower mới có thể đánh giá
    if (booking.borrower._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Chỉ người mượn mới có thể đánh giá",
        },
      });
    }

    // Chỉ có thể đánh giá booking đã hoàn thành
    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_STATUS",
          message: "Chỉ có thể đánh giá booking đã hoàn thành",
        },
      });
    }

    // Kiểm tra đã đánh giá chưa
    if (booking.rating && booking.rating.score) {
      return res.status(400).json({
        success: false,
        error: {
          code: "ALREADY_RATED",
          message: "Booking này đã được đánh giá",
        },
      });
    }

    // Cập nhật rating
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        rating: {
          score,
          comment: comment || "",
          ratedAt: new Date(),
        },
      },
      { new: true }
    ).populate([
      { path: "borrower", select: "profile" },
      { path: "lender", select: "profile" },
      { path: "toy", select: "name images category" },
    ]);

    res.status(200).json({
      success: true,
      data: { booking: updatedBooking },
      message: "Đánh giá thành công",
    });
  } catch (error) {
    console.error("Rate booking error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Lỗi server",
      },
    });
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  returnToy,
  checkExpiredBookings,
  rateBooking,
};
