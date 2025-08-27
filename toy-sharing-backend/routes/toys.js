const express = require("express");
const {
  getToys,
  getToy,
  createToy,
  updateToy,
  deleteToy,
  getMyToys,
  getCategories,
} = require("../controllers/toyController");
const { auth } = require("../middleware/auth");
const {
  validateToy,
  validateObjectId,
  validateQueryParams,
} = require("../middleware/validation");

const router = express.Router();

// PUBLIC
router.get("/categories", getCategories); // <- đặt TRƯỚC /:id, không validate
router.get("/", validateQueryParams, getToys);
router.get("/my-toys", auth, getMyToys);
router.get("/:id", validateObjectId("id"), getToy); // <- sau cùng trong nhóm GET

// PRIVATE

router.post("/", auth, validateToy, createToy);
router.put("/:id", auth, validateObjectId("id"), validateToy, updateToy);
router.delete("/:id", auth, validateObjectId("id"), deleteToy);

module.exports = router;
