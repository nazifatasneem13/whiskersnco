const axios = require("axios");

const fetchPetNews = async (req, res) => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=pets+dogs+cats&apiKey=${process.env.NEWS_API_KEY}`
    );
    res.status(200).json(response.data.articles); // Send articles to the frontend
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news", error });
  }
};

module.exports = { fetchPetNews };
