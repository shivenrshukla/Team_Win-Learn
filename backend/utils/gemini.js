// utils/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize the Generative AI API with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

// Normalize a manga title (used in search)
async function normalizeTitle(raw) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `Extract and return just the manga title from this user query:\n\n"${raw}"\n\nTitle:`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    return response || raw;
  } catch (error) {
    console.error('Error normalizing title with Gemini:', error);
    // Fallback to the original input if Gemini fails
    return raw;
  }
}

// Generate recommendations based on saved titles
async function getGeminiRecommendations(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // Add system instruction to the prompt for cleaner output
    const fullPrompt = `You are a manga recommendation system. Please respond only with manga titles, one per line, with no other text.
    
    ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text().trim();
    
    if (!response) {
      throw new Error('Empty response from Gemini API');
    }
    
    return response;
  } catch (error) {
    console.error('Error getting recommendations from Gemini:', error);
    throw new Error('Failed to get recommendations from Gemini');
  }
}

module.exports = {
  normalizeTitle,
  getGeminiRecommendations
};