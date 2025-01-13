const express = require("express");
const { getNearbyVets } = require("../Controller/VetController");
const router = express.Router();

// New route to fetch nearby vets
router.get("/nearby-vets", getNearbyVets);

module.exports = router;
