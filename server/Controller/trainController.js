// backend/controllers/trainController.js

const TrainingGuide = require("../Model/TrainingGuide");
const User = require("../Model/user.model");
const { Groq } = require("groq-sdk");
require("dotenv").config();

// Initialize Groq client
const groqClient = new Groq({
  apiKey: process.env.GROQ_API, // Ensure this is set in .env
  dangerouslyAllowBrowser: false, // Set to false for backend
});

// Generate Training Guide
const generateTrainingGuide = async (req, res, next) => {
  const { type, breed, age, email, petName } = req.body;

  // Input validation
  if (!type || !breed || age === "" || !email || !petName) {
    return res.status(400).json({
      error: "Missing required fields: type, breed, age, email, petName.",
    });
  }

  if (isNaN(age) || Number(age) < 0) {
    return res.status(400).json({
      error: "Age must be a valid non-negative number.",
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({
        error: "User not found with the provided email.",
      });
    }

    const userId = user._id;

    // Construct the prompt for Groq
    const prompt = `Please generate a structured and comprehensive pet training guide based on the following details:

- Pet Name: ${petName}
- Pet Type: ${type} (e.g., Dog, Cat, Bird, Rabbits, Fish  etc.)
- Breed: ${breed}( Dog: [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "Bulldog",
    "Beagle",
    "Poodle",
    "Rottweiler",
    "Yorkshire Terrier",
    "Boxer",
    "Dachshund",
  ],
  Cat: [
    "Siamese",
    "Persian",
    "Maine Coon",
    "Ragdoll",
    "Sphynx",
    "Bengal",
    "Siberian",
    "Birman",
    "Abyssinian",
    "Russian Blue",
  ],
   Rabbit: [
    "Holland Lop",
    "Netherland Dwarf",
    "Lionhead",
    "Mini Rex",
    "Flemish Giant",
    "English Angora",
    "French Lop",
    "Himalayan",
    "Dutch Rabbit",
    "Harlequin",
  ],
  Bird: [
    "Parakeet",
    "Canary",
    "Finch",
    "Cockatiel",
    "Macaw",
    "Parrot",
    "Lovebird",
    "Budgerigar",
    "Conure",
    "Cockatoo",
  ],
  Fish: [
    "Goldfish",
    "Betta",
    "Guppy",
    "Angelfish",
    "Neon Tetra",
    "Molly",
    "Cichlid",
    "Platy",
    "Swordtail",
    "Zebra Danio",
  ],)
- Age: ${age} months

### Guide Requirements:
1. Divide the training program into weeks (e.g., Week 1, Week 2).
2. Provide weekly objectives suitable for the pet's breed and age.
3. Include detailed training exercises for each week.
4. Highlight progress checkpoints for each week to assess training success.
5. Use bullet points and ensure clarity.

### Additional Context:
- The guide should consider breed-specific behavior traits.
- Tailor exercises to the pet's developmental stage (puppy, adult, senior).`;

    const groqResponse = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in pet training. Provide detailed and structured training guides based on user inputs.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract the training guide from the response
    const trainingGuideText =
      groqResponse.choices[0]?.message?.content?.trim() ||
      "Training guide generation failed.";

    // Save the training guide to the database
    const newTrainingGuide = new TrainingGuide({
      userId,
      petName,
      type,
      breed,
      age: Number(age),
      guide: trainingGuideText,
    });

    await newTrainingGuide.save();

    // Send the entire training guide object back to the frontend
    res.status(201).json(newTrainingGuide);
  } catch (error) {
    console.error("Error generating training guide:", error);
    res.status(500).json({
      error: "Failed to generate training guide.",
    });
  }
};

// Get Training Guides
const getTrainingGuides = async (req, res, next) => {
  const { email } = req.query; // Expecting email as a query parameter

  // Input validation
  if (!email) {
    return res.status(400).json({
      error: "Email query parameter is required.",
    });
  }

  try {
    // Lookup user by email
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({
        error: "User not found with the provided email.",
      });
    }

    const userId = user._id;

    // Fetch all training guides for the user
    const trainingGuides = await TrainingGuide.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ trainingGuides });
  } catch (error) {
    console.error("Error fetching training guides:", error);
    res.status(500).json({
      error: "An unexpected error occurred while fetching training guides.",
    });
  }
};

// Delete Training Guide
const deleteTrainingGuide = async (req, res, next) => {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    return res.status(400).json({ error: "Guide ID is required." });
  }

  try {
    // Find and delete the guide
    const deletedGuide = await TrainingGuide.findByIdAndDelete(id);

    if (!deletedGuide) {
      return res.status(404).json({ error: "Training guide not found." });
    }

    res
      .status(200)
      .json({ message: "Training guide deleted successfully.", id });
  } catch (error) {
    console.error("Error deleting training guide:", error);
    res.status(500).json({ error: "Failed to delete training guide." });
  }
};

module.exports = {
  generateTrainingGuide,
  getTrainingGuides,
  deleteTrainingGuide,
};
