// backend/routes/trainRoute.js

const express = require("express");
const router = express.Router();
const trainController = require("../Controller/trainController");

// Public Routes (No authentication)
router.post("/training-guide", trainController.generateTrainingGuide);
router.get("/training-guides", trainController.getTrainingGuides);
// Delete Route
router.delete("/training-guide/:id", trainController.deleteTrainingGuide);

module.exports = router;
