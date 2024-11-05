const express = require("express");
const { register, login, logout } = require("../Controller/auth.controller"); // Adjust the path if necessary

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router; // Change from export default to module.exports
