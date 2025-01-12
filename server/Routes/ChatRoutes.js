const express = require("express");
const router = express.Router();
const {
  getAdopterChats,
  getAdopteeChats,
  getMessages,
  sendMessage,
  updateChatStatus,
} = require("../Controller/ChatController");

// Fetch adopter chats
router.get("/adopter-chat-list/:userId", getAdopterChats);

// Fetch adoptee chats
router.get("/adoptee-chat-list/:userId", getAdopteeChats);

// Fetch messages for a specific chat
router.get("/messages/:chatId", getMessages);

// Send a new message
router.post("/messages", sendMessage);

// Update chat status (sent, delivered, passive)
router.post("/update-status", updateChatStatus);

module.exports = router;
