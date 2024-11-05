const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },

    desc: {
      type: String,
      required: false,
    },

    petTypes: {
      type: [String], // Array to hold multiple pet types
      required: false,
    },
    vaccinationStatuses: {
      type: [String], // Array for multiple vaccination statuses
      required: false,
      enum: ["vaccinated", "non-vaccinated"],
    },
    preferredPetTypes: {
      type: [String], // Array for multiple preferred pet types
      required: false,
      enum: ["stray", "domesticated"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
