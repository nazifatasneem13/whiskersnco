const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" }, // Reference to the pet
  content: { type: String, maxLength: 200 }, // Review content
  timestamp: { type: Date, default: Date.now }, // Timestamp of the review
});

module.exports = mongoose.model("Review", reviewSchema);
