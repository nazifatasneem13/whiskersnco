const mongoose = require("mongoose");
const schema = mongoose.Schema;

const PetSchema = new schema(
  {
    name: { type: String, required: true },
    age: { type: String, required: true },
    area: { type: String, required: true },
    division: { type: String, required: true },
    justification: { type: String, required: true, default: "" },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    type: {
      type: String,
      required: true,
      // Updated enum to match values from the UI
      enum: ["Dog", "Cat", "Rabbit", "Birds", "Fish", "Others"],
    },
    breed: { type: String, required: true },
    filename: { type: String, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", PetSchema);
