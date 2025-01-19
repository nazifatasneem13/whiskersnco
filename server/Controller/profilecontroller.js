const Pet = require("../Model/PetModel");
const User = require("../Model/user.model");

const findUsersPets = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Fetch pets where the owner email matches the user's email
    const userPets = await Pet.find({ email: user.email });

    if (!userPets.length) {
      return res.status(404).send("No pets found for this user.");
    }

    res.status(200).json(userPets);
  } catch (err) {
    console.error("Error fetching user's pets:", err);
    next(err);
  }
};

module.exports = {
  findUsersPets,
};
