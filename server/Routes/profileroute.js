const express = require("express");
const router = express.Router();
const {
  findUsersPets,
  getUserReviews,
  addReply,
  getUserProfile,
} = require("../Controller/profilecontroller");
const { verifyToken } = require("../middleware/jwt");
router.get("/get", verifyToken, findUsersPets);
router.get("/reviews", verifyToken, getUserReviews);
router.post("/reply", verifyToken, addReply);
router.post("/getuserprofile/profile", getUserProfile);
module.exports = router;
