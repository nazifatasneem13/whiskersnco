const axios = require("axios");
require("dotenv").config();

// Function to fetch nearby vets using Yelp Fusion API
const getNearbyVets = async (req, res) => {
  const { location } = req.query; // Get city/location input from user query
  const YELP_API_KEY = process.env.YELP_API_KEY;

  try {
    if (!location) {
      return res.status(400).json({ message: "Location is required." });
    }

    // Yelp API Endpoint
    const yelpResponse = await axios.get(
      "https://api.yelp.com/v3/businesses/search",
      {
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
        },
        params: {
          location: location, // Location input (city, area)
          term: "veterinary", // Search term
          limit: 5, // Number of results to return
        },
      }
    );

    const vetData = yelpResponse.data.businesses;

    // Send the retrieved vet data as response
    return res.status(200).json({ vets: vetData });
  } catch (error) {
    console.error("Error fetching nearby vets:", error.message);
    return res.status(500).json({
      message: "Failed to fetch nearby vets. Please try again later.",
    });
  }
};

module.exports = { getNearbyVets };
