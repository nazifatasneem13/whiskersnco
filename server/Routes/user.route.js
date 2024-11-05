const express = require("express");
const router = express.Router();
const {
  deleteUser,
  getUser,
  savePreferences,
  updateUser,
  getCurrentUser,
} = require("../Controller/user.controller"); // Ensure this path is correct
const { verifyToken } = require("../middleware/jwt"); // Ensure this path is correct

// Define routes
router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", verifyToken, getUser);
router.get("/profile", verifyToken, getCurrentUser); // Route to get current user profile
router.put("/update", verifyToken, updateUser); // Route to update user profile
router.post("/preferences", verifyToken, savePreferences);

module.exports = router; // Correct CommonJS export
