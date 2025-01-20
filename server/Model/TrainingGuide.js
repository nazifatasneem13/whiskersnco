// backend/models/TrainingGuide.js

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs

const TrainingGuideSchema = new Schema(
  {
    trainId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    guide: {
      type: String,
      required: true,
    },
    progress: {
      type: [
        {
          week: { type: Number, required: true },
          completed: { type: Boolean, required: true, default: false },
        },
      ],
      default: [],
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingGuide", TrainingGuideSchema);
