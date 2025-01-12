const mongoose = require("mongoose");
const schema = mongoose.Schema;

const PetSchema = new schema(
  {
    name: { type: String, required: true },
    age: { type: String, required: true },
    area: { type: String, required: true },
    division: { type: String, required: true },
    justification: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Dog", "Cat", "Rabbit", "Bird", "Fish", "Other"], // Define accepted types
    },
    breed: { type: String, required: true },
    filename: { type: String, required: true },
    status: { type: String, default: "Pending" }, // Default status to "Pending"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", PetSchema);
