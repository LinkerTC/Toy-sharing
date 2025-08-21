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
    const { toyId, startDate, endDate, borrowerMessage } = req.body;

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
      status: { $in: ["requested", "confirmed"] },
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

    // Tạo booking mới
    const booking = await Booking.create({
      toy: toyId,
      borrower: req.user._id,
      lender: toy.owner,
      startDate,
      endDate,
      borrowerMessage,
    });

    // Populate để trả về đầy đủ thông tin
    await booking.populate([
      { path: "borrower", select: "profile" },
      { path: "lender", select: "profile" },
      { path: "toy", select: "name images category ageGroup pickupAddress" },
    ]);

    res.status(201).json({
      success: true,
      data: { booking },
      message: "Gửi yêu cầu mượn thành công",
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

    // Chỉ lender mới có quyền cập nhật status
    if (booking.lender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Chỉ chủ đồ chơi mới có thể cập nhật trạng thái",
        },
      });
    }

    // Validate status transitions
    const validTransitions = {
      requested: ["confirmed", "cancelled"],
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

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
};
