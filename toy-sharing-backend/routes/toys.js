const express = require("express");
const {
  getToys,
  getToy,
  createToy,
  updateToy,
  deleteToy,
  getMyToys,
} = require("../controllers/toyController");
const {
  validateToy,
  validateObjectId,
  validateQueryParams,
} = require("../middleware/validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/toys
// @desc    Lấy danh sách tất cả đồ chơi (với search & filter)
// @access  Public
router.get("/", validateQueryParams, getToys);

// @route   GET /api/toys/my-toys
// @desc    Lấy đồ chơi của user hiện tại
// @access  Private
router.get("/my-toys", auth, getMyToys);

// @route   GET /api/toys/:id
// @desc    Lấy chi tiết một đồ chơi
// @access  Public
router.get("/:id", validateObjectId("id"), getToy);

// @route   POST /api/toys
// @desc    Tạo đồ chơi mới
// @access  Private
router.post("/", auth, validateToy, createToy);

// @route   PUT /api/toys/:id
// @desc    Cập nhật đồ chơi
// @access  Private (Owner only)
router.put("/:id", auth, validateObjectId("id"), validateToy, updateToy);

// @route   DELETE /api/toys/:id
// @desc    Xóa đồ chơi
// @access  Private (Owner only)
router.delete("/:id", auth, validateObjectId("id"), deleteToy);

module.exports = router;
