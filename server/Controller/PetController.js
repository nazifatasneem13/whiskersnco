const Pet = require("../Model/PetModel");
const ChatModel = require("../Model/Chat");
const Notification = require("../Model/Notification");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary.js");
const User = require("../Model/user.model");
const sharp = require("sharp"); // For image preprocessing
const tf = require("@tensorflow/tfjs-node");
console.log(tf.version.tfjs);
const { Groq } = require("groq-sdk");

const multer = require("multer");

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_PetType,
  dangerouslyAllowBrowser: false, // Use server-side only
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const predictPetType = async (req, res) => {
  try {
    // Ensure the file (image) is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Upload the image to Cloudinary (or another service)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "pets",
    });

    const imageUrl = result.secure_url; // Get the URL of the uploaded image

    // Call Groq for pet type classification
    const groqResponse = await groqClient.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Choose an option(one word answer): What type of animal is it? Options:  Dog, Cat, Fish, Rabbit, Birds, Others",
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl, // Provide the Cloudinary image URL here
              },
            },
          ],
        },
      ],
      model: "llama-3.2-90b-vision-preview",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    // Extract the predicted pet type from the response
    const predictedType = groqResponse.choices[0]?.message?.content?.trim();

    if (!predictedType) {
      return res.status(500).json({ error: "Error predicting pet type" });
    }

    // Send the predicted pet type back to the frontend
    res.status(200).json({ type: predictedType });
  } catch (error) {
    console.error("Error predicting pet type:", error);
    res
      .status(500)
      .json({ error: "Error predicting pet type. Please try again." });
  }
};

// Define paths for model JSON files (TensorFlow.js format)
const dogModelPath = path.join(__dirname, "../Model/Dog/model.json");
const catModelPath = path.join(__dirname, "../Model/Cat/model.json");

let dogModel, catModel;

// Load the models
const loadModels = async () => {
  try {
    console.log("Loading Dog model...");
    dogModel = await tf.loadLayersModel(`file://${dogModelPath}`);
    console.log("Dog model loaded successfully.");
    console.log("Loading Cat model...");
    catModel = await tf.loadLayersModel(`file://${catModelPath}`);
    console.log("Cat model loaded successfully.");
  } catch (err) {
    console.error("Error loading models:", err);
  }
};

loadModels(); // Load models at server startup

// Define breed labels
const dogBreedLabels = [
  "american",
  "basset",
  "beagle",
  "boxer",
  "chihuahua",
  "english",
  "german",
  "great",
  "havanese",
  "japanese",
  "keeshond",
  "leonberger",
  "miniature",
  "newfoundland",
  "pomeranian",
  "pug",
  "saint",
  "samoyed",
  "scottish",
  "shiba",
  "staffordshire",
  "wheaten",
  "yorkshire",
];
const catBreedLabels = [
  "Abyssinian",
  "Bengal",
  "Birman",
  "Bombay",
  "British",
  "Egyptian",
  "Maine",
  "Persian",
  "Ragdoll",
  "Russian",
  "Siamese",
  "Sphynx",
];

// Predict Breed Endpoint
const predictBreed = async (req, res) => {
  try {
    const { type } = req.body;
    if (!req.file || !type) {
      return res.status(400).json({ error: "Image and type are required" });
    }

    // Read and preprocess the image
    const imageBuffer = fs.readFileSync(req.file.path);

    // Resize the image using Sharp and convert it to a Tensor
    const processedImage = await sharp(imageBuffer)
      .resize(250, 250) // Resize to match model input size (250x250)
      .toBuffer(); // Output image as a buffer

    // Decode the image into a Tensor using TensorFlow.js
    const tensor = tf.node
      .decodeImage(processedImage, 3)
      .expandDims(0)
      .div(255.0); // Normalize image to [0, 1]

    // Determine the model and labels based on pet type
    let model, breedLabels;
    if (type === "Dog") {
      if (!dogModel) {
        return res.status(500).json({ error: "Dog model is not loaded yet." });
      }
      model = dogModel;
      breedLabels = dogBreedLabels;
    } else if (type === "Cat") {
      if (!catModel) {
        return res.status(500).json({ error: "Cat model is not loaded yet." });
      }
      model = catModel;
      breedLabels = catBreedLabels;
    } else {
      return res.status(400).json({ error: "Unsupported pet type" });
    }

    // Predict breed
    const prediction = model.predict(tensor);
    const predictedIndex = tf.argMax(prediction, 1).dataSync()[0];

    // Get the breed label based on the predicted index
    const breed = breedLabels[predictedIndex];

    res.status(200).json({ breed });
  } catch (error) {
    console.error("Error predicting breed:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    // Clean up uploaded file if necessary
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path); // Remove the uploaded file after processing
    }
  }
};

// Controller to handle posting a new pet request with both pet picture and NID picture
const postPetRequest = async (req, res) => {
  try {
    const {
      name,
      age,
      area,
      division,
      // Provide a default fallback in case no justification is sent
      justification: justificationText = "",
      email,
      phone,
      type,
      breed,
    } = req.body;

    // Ensure the pet picture file is provided
    if (!req.files || !req.files.picture || req.files.picture.length === 0) {
      return res.status(400).json({ error: "No pet image file provided" });
    }

    // Upload the pet picture to Cloudinary
    const pictureFile = req.files.picture[0];
    const pictureResult = await cloudinary.uploader.upload(pictureFile.path, {
      folder: "pets",
    });

    let justificationUrl = justificationText; // fallback text (could be empty)

    // Check if a justification video file was provided
    if (
      req.files.justificationVideo &&
      req.files.justificationVideo.length > 0
    ) {
      const videoFile = req.files.justificationVideo[0];
      // Upload the video file with the video resource type
      const videoResult = await cloudinary.uploader.upload(videoFile.path, {
        folder: "pets",
        resource_type: "video",
      });
      justificationUrl = videoResult.secure_url;
    }

    // Create a new Pet document with the uploaded files and other details
    const pet = await Pet.create({
      name,
      age,
      division,
      area,
      justification: justificationUrl,
      email,
      phone,
      type,
      breed,
      filename: pictureResult.secure_url,
      status: "Pending",
    });

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to handle approving a pet request
const approveRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, phone, status } = req.body;
    const pet = await Pet.findByIdAndUpdate(
      id,
      { email, phone, status },
      { new: true }
    );
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    const user = await User.findOne({ email: pet.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a notification
    await Notification.create({
      userId: user._id,
      message: `Your request for ${pet.name} has been ${status.toLowerCase()}.`,
    });
    res.status(200).json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to retrieve all pets with a specified status
const allPets = async (reqStatus, req, res) => {
  try {
    const data = await Pet.find({ status: reqStatus }).sort({ updatedAt: -1 });
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to handle deleting a pet request
const deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    const pet = await Pet.findByIdAndUpdate(
      id,
      {
        status: "deleted",
      },
      { new: true }
    );

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPreferredPets = (reqStatus) => async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(
      `Received request to fetch pets for userId: ${userId} with status: ${reqStatus}`
    );

    if (!userId) {
      console.error("User ID is missing in the request body.");
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error(`User not found. userId: ${userId}`);
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.petTypes || user.petTypes.length === 0) {
      console.error(`User has no pet preferences. userId: ${userId}`);
      return res
        .status(404)
        .json({ message: "No matching preferences found." });
    }

    // 1. Users who have blocked the current user
    const blockedByUsersIds = user.blockedBy; // Array of User IDs

    // Fetch emails of users who have blocked the current user
    const blockedByUsers = await User.find({
      _id: { $in: blockedByUsersIds },
    }).select("email");
    const blockedByEmails = blockedByUsers.map((u) => u.email);
    console.log(
      `Users who have blocked current user (${userId}):`,
      blockedByEmails
    );

    // 2. Users whom the current user has blocked
    const usersWhomUserHasBlocked = await User.find({
      blockedBy: userId,
    }).select("email");
    const blockedUsersEmails = usersWhomUserHasBlocked.map((u) => u.email);
    console.log(
      `Users whom current user (${userId}) has blocked:`,
      blockedUsersEmails
    );

    // Combine both blocked emails
    const allBlockedEmails = [...blockedByEmails, ...blockedUsersEmails];
    console.log(`All blocked emails for userId ${userId}:`, allBlockedEmails);

    // Fetch pets that match the user's preferences, have the specified status,
    // and are not owned by blocked users
    const pets = await Pet.find({
      status: reqStatus, // Filter by status
      $or: [
        { type: { $in: user.petTypes } }, // Match pets with user's preferred pet types
        { division: { $in: user.areas } }, // Match pets where the division matches user's areas
      ],
      $and: [
        { email: { $nin: allBlockedEmails } },
        { email: { $nin: user.email } },
      ], // Exclude pets owned by blocked users
    }).sort({ updatedAt: -1 });

    console.log(`Number of pets found for userId ${userId}: ${pets.length}`);

    if (pets.length === 0) {
      pets = await Pet.find({
        status: reqStatus, // Filter by status
        staus: { $in: "Approved" },
        $and: [
          { email: { $nin: allBlockedEmails } },
          { email: { $nin: user.email } },
        ], // Exclude pets owned by blocked users
      }).sort({ updatedAt: -1 });
    }

    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching preferred pets:", error);
    res.status(500).json({ message: "Server error while fetching pets." });
  }
};

const approveadoptRequest = async (req, res) => {
  try {
    const id = req.params.id; // Pet ID
    const { email, phone, status } = req.body; // Adopter's email and phone, and status

    // Update the pet's status and other details
    const pet = await Pet.findByIdAndUpdate(id, { status }, { new: true });

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // Find the adopter's user ID
    const adopter = await User.findOne({ email });
    if (!adopter) {
      return res.status(404).json({ error: "Adopter not found" });
    }

    // Find the adoptee's user ID
    const adoptee = await User.findOne({ email: pet.email });
    if (!adoptee) {
      return res.status(404).json({ error: "Adoptee not found" });
    }

    // Create a new chat in the ChatModel
    const chat = await ChatModel.create({
      adopterId: adopter._id,
      adopteeId: adoptee._id,
      petId: pet._id,
    });

    // Create a notification
    await Notification.create({
      userId: adopter._id,
      message: `Your request for ${pet.name} has been approved, check chats for continuing the process.`,
    });
    await Notification.create({
      userId: adoptee._id,
      message: `${adopter.email} has shown interest to adopt your pet ${pet.name},check chats for continuing the process.`,
    });
    res.status(200).json({ pet, chat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const allPetsDisplay = (reqStatus) => async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(
      `Received request to fetch pets for userId: ${userId} with status: ${reqStatus}`
    );

    if (!userId) {
      console.error("User ID is missing in the request body.");
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error(`User not found. userId: ${userId}`);
      return res.status(404).json({ message: "User not found." });
    }

    // 1. Users who have blocked the current user
    const blockedByUsersIds = user.blockedBy; // Array of User IDs

    // Fetch emails of users who have blocked the current user
    const blockedByUsers = await User.find({
      _id: { $in: blockedByUsersIds },
    }).select("email");
    const blockedByEmails = blockedByUsers.map((u) => u.email);
    console.log(
      `Users who have blocked current user (${userId}):`,
      blockedByEmails
    );

    const usersWhomUserHasBlocked = await User.find({
      blockedBy: userId,
    }).select("email");
    const blockedUsersEmails = usersWhomUserHasBlocked.map((u) => u.email);
    console.log(
      `Users whom current user (${userId}) has blocked:`,
      blockedUsersEmails
    );

    const allBlockedEmails = [...blockedByEmails, ...blockedUsersEmails];
    console.log(`All blocked emails for userId ${userId}:`, allBlockedEmails);

    const data = await Pet.find({ status: reqStatus }).sort({ updatedAt: -1 });
    const pets = await Pet.find({
      status: reqStatus, // Filter by status

      email: { $nin: allBlockedEmails }, // Exclude pets owned by blocked users
    }).sort({ updatedAt: -1 });

    if (pets.length === 0) {
      console.log(
        `No pets found for userId: ${userId} with status: ${reqStatus}`
      );
      return res
        .status(404)
        .json({ message: "No pets found for the given preferences." });
    }

    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching preferred pets:", error);
    res.status(500).json({ message: "Server error while fetching pets." });
  }
};

const getnotPreferredPets = (reqStatus) => async (req, res) => {
  try {
    console.log(`Fetching all pets with status: ${reqStatus}`);

    // Fetch all pets where status is "Approved"
    const pets = await Pet.find({ status: reqStatus }).sort({ updatedAt: -1 });

    console.log(`Total approved pets found: ${pets.length}`);
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching non-preferred pets:", error);
    res.status(500).json({ message: "Server error while fetching pets." });
  }
};

// Export controllers
module.exports = {
  postPetRequest,
  approveRequest,
  deletePost,
  allPets,
  predictBreed,
  getPreferredPets,
  approveadoptRequest,
  allPetsDisplay,
  predictPetType,
  getnotPreferredPets,
};
