const User = require("../Model/user.model");
const Pet = require("../Model/PetModel");
const mongoose = require("mongoose");
const getWishlistDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("wishlist");

    if (!user) return res.status(404).send("User not found.");

    res.status(200).send(user.wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch wishlist details.");
  }
};
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).send("User not found.");

    // Permanently remove the pet from the wishlist
    const index = user.wishlist.findIndex(
      (id) => id.toString() === req.body.petId.toString()
    );
    if (index !== -1) {
      user.wishlist.splice(index, 1); // Remove the pet from the wishlist
      await user.save(); // Save the updated user
    } else {
      return res.status(404).send("Pet not found in the wishlist.");
    }

    res.status(200).send("Pet removed from wishlist.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to remove from wishlist.");
  }
};

module.exports = { getWishlistDetails, removeFromWishlist };
