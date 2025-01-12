const express = require("express");
const { verifyToken } = require("../middleware/jwt");
const {
  getWishlistDetails,
  removeFromWishlist,
} = require("../Controller/wishlist");

const router = express.Router();

router.get("/wishlist/details", verifyToken, getWishlistDetails);
router.post("/wishlistremove", verifyToken, removeFromWishlist);
module.exports = router;
