const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    adopterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adopteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    status: {
      type: String,
      enum: ["active", "passive", "sent", "delivered", "blocked"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
