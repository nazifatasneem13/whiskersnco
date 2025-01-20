const express = require("express");
const { verifyToken } = require("../middleware/jwt");
const {
  getUserNotifications,
  getUnreadCount,
  markAllAsRead,
} = require("../Controller/NotifyController");

const router = express.Router();

// Notifications route
router.get("/notifications", verifyToken, getUserNotifications);
router.get("/notifications/unread", verifyToken, getUnreadCount);
router.put("/notifications/read", verifyToken, markAllAsRead);

module.exports = router;
