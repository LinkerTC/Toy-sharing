const express = require("express");
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment,
} = require("../controllers/commentController");
const { auth } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validation");

const router = express.Router();

// PUBLIC
router.get("/:toyId", validateObjectId("toyId"), getComments);

// PRIVATE
router.post("/:toyId", auth, validateObjectId("toyId"), createComment);
router.put("/:id", auth, validateObjectId("id"), updateComment);
router.delete("/:id", auth, validateObjectId("id"), deleteComment);
router.post("/:id/like", auth, validateObjectId("id"), toggleLikeComment);

module.exports = router;
