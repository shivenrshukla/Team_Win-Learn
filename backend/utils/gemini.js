// utils/gemini.js
const axios = require('axios');
require('dotenv').config();

const geminiClient = axios.create({
  baseURL: process.env.GEMINI_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
  }
});

// Normalize a manga title (used in search)
async function normalizeTitle(raw) {
  const prompt = `Extract and return just the manga title from this user query:\n\n"${raw}"\n\nTitle:`;
  const body = {
    instances: [{ content: prompt }],
    parameters: { temperature: 0.2, maxOutputTokens: 32 }
  };

  const { data } = await geminiClient.post('', body);
  return data.predictions?.[0]?.content?.trim() || raw;
}

// Generate recommendations based on saved titles
async function getGeminiRecommendations(prompt) {
  const body = {
    instances: [{ content: prompt }],
    parameters: { temperature: 0.7, maxOutputTokens: 256 }
  };

  const { data } = await geminiClient.post('', body);
  return data.predictions?.[0]?.content?.trim();
}

module.exports = {
  normalizeTitle,
  getGeminiRecommendations
};

