const Pet = require("../Model/PetModel");
const ChatModel = require("../Model/Chat");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary.js");
const User = require("../Model/user.model");
const sharp = require("sharp"); // For image preprocessing
const tf = require("@tensorflow/tfjs-node");
console.log(tf.version.tfjs);

// Define paths for model JSON files (TensorFlow.js format)
const dogModelPath = path.join(__dirname, "../Model/Dog/model.json");
const catModelPath = path.join(__dirname, "../Model/Cat/model.json");
const birdModelPath = path.join(__dirname, "../Model/Bird/model.json");

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

const birdBreedLabels = [
  "black_footed_albatross",
  "laysan_albatross",
  "sooty_albatross",
  "groove_billed_ani",
  "crested_auklet",
  "least_auklet",
  "parakeet_auklet",
  "rhinoceros_auklet",
  "brewer_blackbird",
  "red_winged_blackbird",
  "rusty_blackbird",
  "yellow_headed_blackbird",
  "bobolink",
  "indigo_bunting",
  "lazuli_bunting",
  "painted_bunting",
  "cardinal",
  "spotted_catbird",
  "gray_catbird",
  "yellow_breasted_chat",
  "eastern_towhee",
  "chuck_will_widow",
  "brandt_cormorant",
  "red_faced_cormorant",
  "pelagic_cormorant",
  "bronzed_cowbird",
  "shiny_cowbird",
  "brown_creeper",
  "american_crow",
  "fish_crow",
  "black_billed_cuckoo",
  "mangrove_cuckoo",
  "yellow_billed_cuckoo",
  "gray_crowned_rosy_finch",
  "purple_finch",
  "northern_flicker",
  "acadian_flycatcher",
  "great_crested_flycatcher",
  "least_flycatcher",
  "olive_sided_flycatcher",
  "scissor_tailed_flycatcher",
  "vermilion_flycatcher",
  "yellow_bellied_flycatcher",
  "frigatebird",
  "northern_fulmar",
  "gadwall",
  "american_goldfinch",
  "european_goldfinch",
  "boat_tailed_grackle",
  "eared_grebe",
  "horned_grebe",
  "pied_billed_grebe",
  "western_grebe",
  "blue_grosbeak",
  "evening_grosbeak",
  "pine_grosbeak",
  "rose_breasted_grosbeak",
  "pigeon_guillemot",
  "california_gull",
  "glaucous_winged_gull",
  "heermann_gull",
  "herring_gull",
  "ivory_gull",
  "ring_billed_gull",
  "slaty_backed_gull",
  "western_gull",
  "anna_hummingbird",
  "ruby_throated_hummingbird",
  "rufous_hummingbird",
  "green_violetear",
  "long_tailed_jaeger",
  "pomarine_jaeger",
  "blue_jay",
  "florida_jay",
  "green_jay",
  "dark_eyed_junco",
  "tropical_kingbird",
  "gray_kingbird",
  "belted_kingfisher",
  "green_kingfisher",
  "pied_kingfisher",
  "ringed_kingfisher",
  "white_breasted_kingfisher",
  "red_legged_kittiwake",
  "horned_lark",
  "pacific_loon",
  "mallard",
  "western_meadowlark",
  "hooded_merganser",
  "red_breasted_merganser",
  "mockingbird",
  "nighthawk",
  "clark_nutcracker",
  "white_breasted_nuthatch",
  "baltimore_oriole",
  "hooded_oriole",
  "orchard_oriole",
  "scott_oriole",
  "ovenbird",
  "brown_pelican",
  "white_pelican",
  "western_wood_pewee",
  "sayornis",
  "american_pipit",
  "whip_poor_will",
  "horned_puffin",
  "common_raven",
  "white_necked_raven",
  "american_redstart",
  "geococcyx",
  "loggerhead_shrike",
  "great_grey_shrike",
  "baird_sparrow",
  "black_throated_sparrow",
  "brewer_sparrow",
  "chipping_sparrow",
  "clay_colored_sparrow",
  "house_sparrow",
  "field_sparrow",
  "fox_sparrow",
  "grasshopper_sparrow",
  "harris_sparrow",
  "henslow_sparrow",
  "le_conte_sparrow",
  "lincoln_sparrow",
  "nelson_sharp_tailed_sparrow",
  "savannah_sparrow",
  "seaside_sparrow",
  "song_sparrow",
  "tree_sparrow",
  "vesper_sparrow",
  "white_crowned_sparrow",
  "white_throated_sparrow",
  "cape_glossy_starlings",
  "bank_swallow",
  "barn_swallow",
  "cliff_swallow",
  "tree_swallow",
  "scarlet_tanager",
  "summer_tanager",
  "artic_tern",
  "black_tern",
  "caspian_tern",
  "common_tern",
  "elegant_tern",
  "forsters_tern",
  "least_tern",
  "green_tailed_towhee",
  "brown_thrasher",
  "sage_thrasher",
  "black_capped_vireo",
  "blue_headed_vireo",
  "philadelphia_vireo",
  "red_eyed_vireo",
  "warbling_vireo",
  "white_eyed_vireo",
  "yellow_throated_vireo",
  "bay_breasted_warbler",
  "black_and_white_warbler",
  "black_throated_blue_warbler",
  "blue_winged_warbler",
  "canada_warbler",
  "cape_may_warbler",
  "cerulean_warbler",
  "chestnut_sided_warbler",
  "golden_winged_warbler",
  "hooded_warbler",
  "kentucky_warbler",
  "magnolia_warbler",
  "mourning_warbler",
  "myrtle_warbler",
  "nashville_warbler",
  "orange_crowned_warbler",
  "palm_warbler",
  "pine_warbler",
  "prairie_warbler",
  "prothonotary_warbler",
  "swainson_warbler",
  "tennessee_warbler",
  "wilson_warbler",
  "worm_eating_warbler",
  "yellow_warbler",
  "northern_waterthrush",
  "louisiana_waterthrush",
  "bohemian_waxwing",
  "cedar_waxwing",
  "american_three_toed_woodpecker",
  "pileated_woodpecker",
  "red_bellied_woodpecker",
  "red_cockaded_woodpecker",
  "red_headed_woodpecker",
  "downy_woodpecker",
  "bewick_wren",
  "cactus_wren",
  "carolina_wren",
  "house_wren",
  "marsh_wren",
  "rock_wren",
  "winter_wren",
  "common_yellowthroat",
];

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
      justification,
      email,
      phone,
      type,
      breed,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "pets",
    });

    // Create a new Pet document in the database
    const pet = await Pet.create({
      name,
      age,
      division,
      area,
      justification,
      email,
      phone,
      type,
      breed,
      filename: result.secure_url, // Store Cloudinary URL
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
    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // Delete the image from Cloudinary (if needed)
    const filename = pet.filename.split("/").pop().split(".")[0]; // Extract public_id from Cloudinary URL
    await cloudinary.uploader.destroy(filename);

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to get pets based on user preferences
const getPreferredPets = (reqStatus) => async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user || !user.petTypes || user.petTypes.length === 0) {
      return res.status(404).json({ message: "No matching preferences found" });
    }

    // Fetch pets that match the user's preferences and have the specified status
    const pets = await Pet.find({
      status: reqStatus, // Filter by status
      $or: [
        { type: { $in: user.petTypes } }, // Match pets with user's preferred pet types
        { division: { $in: user.areas } }, // Match pets where the division matches user's areas
      ],
    }).sort({ updatedAt: -1 });

    if (pets.length === 0) {
      return res
        .status(404)
        .json({ message: "No pets found for the given preferences" });
    }

    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching preferred pets:", error);
    res.status(500).json({ message: "Server error while fetching pets" });
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

    res.status(200).json({ pet, chat });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
};
