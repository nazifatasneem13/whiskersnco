// server/config/openai.js

const OpenAI = require("openai");
require("dotenv").config(); // Ensure environment variables are loaded

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;
