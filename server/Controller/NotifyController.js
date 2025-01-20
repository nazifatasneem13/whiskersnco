const Notification = require("../Model/Notification");

const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.userId; // Extracted from `verifyToken` middleware
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20); // Limit to recent 20 notifications

    if (!notifications || notifications.length === 0) {
      return res.status(404).send("No notifications found.");
    }

    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notifications as read." });
  }
};

// Get Unread Count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unread count." });
  }
};
module.exports = { getUserNotifications, getUnreadCount, markAllAsRead };
