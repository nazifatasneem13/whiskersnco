const express = require("express");
const {
  deleteUser,
  getUser,
  savePreferences,
  updateUser,
  addToWishlist,
  getBlockedUser,
  unblockUser,
} = require("../Controller/user.controller"); // Ensure this path is correct
const { verifyToken } = require("../middleware/jwt"); // Ensure this path is correct

const router = express.Router();

router.delete("/:id", verifyToken, deleteUser);
router.get("/blocked/hasblocked", verifyToken, getBlockedUser);
router.post("/unblock", verifyToken, unblockUser);
router.get("/:id", verifyToken, getUser);
router.post("/preferences", verifyToken, savePreferences);
router.get("/profile", verifyToken, getUser);
router.put("/update", verifyToken, updateUser);
router.post("/wishlist", verifyToken, addToWishlist);

module.exports = router; // Correct CommonJS export
