const express = require("express");
const { fetchPetNews } = require("../Controller/newsController");
const router = express.Router();

router.get("/news", fetchPetNews);

module.exports = router;
