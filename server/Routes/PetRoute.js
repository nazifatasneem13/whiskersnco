const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  postPetRequest,
  approveRequest,
  deletePost,
  allPets,
  getPreferredPets,
  predictBreed,
  approveadoptRequest,
} = require("../Controller/PetController");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images")); // Path to save uploaded images
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

// Routes
router.get("/requests", (req, res) => allPets("Pending", req, res));
router.get("/approvedPets", (req, res) => allPets("Approved", req, res));
router.get("/adoptedPets", (req, res) => allPets("Delivered", req, res));
router.post("/services", upload.single("picture"), postPetRequest);
router.put("/approving/:id", approveRequest);
router.delete("/delete/:id", deletePost);
router.post("/preferredPets", getPreferredPets("Approved"));
router.put("/approvingadopt/:id", approveadoptRequest);
// New route for breed prediction
router.post("/predict-breed", upload.single("image"), predictBreed);

module.exports = router;
