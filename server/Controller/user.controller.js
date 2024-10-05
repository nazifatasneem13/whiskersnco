const User = require("../Model/user.model"); // Ensure this path is correct
const createError = require("../utils/createError");

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can delete only your account."));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("deleted.");
  } catch (err) {
    next(err); // Make sure to handle errors
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (err) {
    next(err); // Make sure to handle errors
  }
};

// Export the functions
module.exports = {
  deleteUser,
  getUser,
};
