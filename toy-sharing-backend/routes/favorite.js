const express = require("express");
const { auth } = require("../middleware/auth");
const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require("../controllers/FavoriteController");

const router = express.Router();

router.post("/:toyId", auth, addFavorite);
router.delete("/:toyId", auth, removeFavorite);
router.get("/", auth, getFavorites);

module.exports = router;
