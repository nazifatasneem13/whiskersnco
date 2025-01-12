// routes/MessageRoutes.js
const express = require("express");
const router = express.Router();
const {
  getMessagesForChat,
  sendMessage,
} = require("../Controller/MessageController");

router.get("/:chatId", getMessagesForChat); // Get messages for a specific chat
router.post("/", sendMessage); // Send a message

module.exports = router;
