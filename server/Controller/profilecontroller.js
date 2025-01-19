const Pet = require("../Model/PetModel");
const User = require("../Model/user.model");

const Review = require("../Model/review");

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

const getUserReviews = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Find reviews where the user is the reviewingId and pet status is "Delivered"
    const reviews = await Review.find({ reviewingId: user._id })
      .populate({
        path: "petId",
        match: { status: "Delivered" }, // Ensure pet status is "Delivered"
        select: "name filename status", // Select relevant fields
      })
      .populate("reviewerId", "username email") // Populate reviewer details
      .lean();

    // Filter out reviews with no valid `petId` (non-delivered pets)
    const filteredReviews = reviews.filter((review) => review.petId);

    if (!filteredReviews.length) {
      return res
        .status(404)
        .send("No reviews found for this user with delivered pets.");
    }

    res.status(200).json(filteredReviews);
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    next(err);
  }
};

const addReply = async (req, res) => {
  try {
    const { reviewId, content } = req.body;
    const userId = req.userId; // From authentication middleware

    if (!content) {
      return res.status(400).json({ error: "Reply content is required." });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    const reply = {
      content,
    };

    review.replies.push(reply);
    await review.save();

    res.status(200).json({ message: "Reply added successfully.", reply });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: "Server error while adding reply." });
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Step 1: Find the user by email
    const user = await User.findOne({ email }).select("username email");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Step 2: Fetch reviews where the user is the reviewer (reviewsAsDonator)
    const reviewsAsDonator = await Review.find({ reviewerId: user._id })
      .populate("reviewingId", "username") // Populate the reviewing user (adopter)
      .populate("petId", "name") // Populate the pet details
      .select("content timestamp reviewingId petId replies");

    // Step 3: Fetch reviews where the user is being reviewed (reviewsAsAdopter)
    const reviewsAsAdopter = await Review.find({ reviewingId: user._id })
      .populate("reviewerId", "username") // Populate the reviewer
      .populate("petId", "name") // Populate the pet details
      .select("content timestamp reviewerId petId replies");

    // Step 4: Format reviews to user-friendly data
    const formattedReviewsAsDonator = reviewsAsDonator.map((review) => ({
      content: review.content,
      petName: review.petId?.name || "N/A",
      reviewedBy: review.reviewingId?.username || "Unknown", // username populated here
      timestamp: review.timestamp,
      replies: review.replies.map((reply) => ({
        content: reply.content,
        timestamp: reply.timestamp,
      })), // Include replies here
    }));

    const formattedReviewsAsAdopter = reviewsAsAdopter.map((review) => ({
      content: review.content,
      petName: review.petId?.name || "N/A",
      reviewer: review.reviewerId?.username || "Unknown", // username populated here
      timestamp: review.timestamp,
      replies: review.replies.map((reply) => ({
        content: reply.content,
        timestamp: reply.timestamp,
      })), // Include replies here
    }));

    // Step 5: Send the response with user profile and reviews
    res.status(200).json({
      username: user.username,
      email: user.email,
      reviewsAsAdopter: formattedReviewsAsAdopter,
      reviewsAsDonator: formattedReviewsAsDonator,
    });
  } catch (error) {
    console.error("Error fetching user profile and reviews:", error);
    next(error); // Pass error to error-handling middleware
  }
};

module.exports = {
  findUsersPets,
  getUserReviews,
  addReply,
  getUserProfile,
};
