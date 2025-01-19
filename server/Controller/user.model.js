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
      required: function () {
        return !this.uid; // Require password only if `uid` is not present
      },
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
      type: [String],
      required: false,
    },
    areas: {
      type: [String],
      required: false,
      enum: [
        "Barishal",
        "Chattogram",
        "Dhaka",
        "Khulna",
        "Mymensingh",
        "Rajshahi",
        "Rangpur",
        "Sylhet",
      ],
    },
    uid: {
      type: String,
      required: false, // Optional, only for Google users
      unique: true, // Ensure uniqueness for Google users
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet", // Assuming you have a Pet model
      },
    ],
    blockedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Hasblocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
