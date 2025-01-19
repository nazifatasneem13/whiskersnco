const express = require("express");
const router = express.Router();
const { findUsersPets } = require("../Controller/profilecontroller");
const { verifyToken } = require("../middleware/jwt");
router.get("/get", verifyToken, findUsersPets);

module.exports = router;
