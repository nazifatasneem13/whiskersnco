const User = require("../Model/user.model"); // Ensure this path is correct
const createError = require("../utils/createError");
const multer = require("multer");
const path = require("path");

// Configure multer to store images on the server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.userId}${ext}`); // e.g., userId.jpg
  },
});

const upload = multer({ storage: storage });

// Update User
const updateUser = async (req, res, next) => {
  try {
    const userId = req.userId; // Retrieved from verifyToken middleware
    const updateData = { ...req.body };

    if (req.file) {
      // Assuming 'img' is the field name
      updateData.img = `/uploads/users/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return next(createError(404, "User not found."));
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// Middleware to handle image upload and update
const updateUserWithImage = [upload.single("img"), updateUser];

// Get Current User
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return next(createError(404, "User not found."));
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Existing Controller Functions
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
    const user = await User.findById(req.params.id).select("-password"); // Exclude password
    res.status(200).send(user);
  } catch (err) {
    next(err); // Make sure to handle errors
  }
};

const savePreferences = async (req, res, next) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the session or auth token
    const { petTypes, vaccinationStatuses, preferredPetTypes } = req.body;

    // Update the user with multiple preference selections
    await User.findByIdAndUpdate(userId, {
      petTypes,
      vaccinationStatuses,
      preferredPetTypes,
    });

    res.status(200).send("Preferences saved successfully.");
  } catch (err) {
    next(err);
  }
};

// Export the functions
module.exports = {
  deleteUser,
  getUser,
  savePreferences,
  updateUser: updateUserWithImage, // Export the updateUser middleware
  getCurrentUser,
};
