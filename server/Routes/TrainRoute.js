// backend/routes/trainRoute.js

const express = require("express");
const router = express.Router();
const trainController = require("../Controller/trainController");

// Public Routes (No authentication)
router.post("/training-guide", trainController.generateTrainingGuide);
router.get("/training-guides", trainController.getTrainingGuides);
router.patch("/training-guide/progress", trainController.updateProgress);
router.delete("/training-guide/:id", trainController.deleteTrainingGuide);
router.post("/archive-guide", trainController.archiveGuide);
router.get("/archived-guides", trainController.getArchivedGuides);

module.exports = router;
