// backend/utils/mangadex.js
const axios = require('axios');

// Function to search manga
const scrapeMangaSearch = async (keyword) => {
  const response = await axios.get(`https://api.mangadex.org/v2/manga?title=${keyword}`);
  return response.data.data; // Adapt based on the API response structure
};

// Function to scrape chapter images
const scrapeChapterImages = async (chapterId) => {
  const response = await axios.get(`https://api.mangadex.org/v2/chapters/${chapterId}`);
  return response.data.images; // Adapt based on the API response structure
};

// Function to scrape manga chapters
const scrapeMangaChapters = async (mangaId) => {
  const response = await axios.get(`https://api.mangadex.org/v2/manga/${mangaId}/chapters`);
  return response.data.chapters; // Adapt based on the API response structure
};

module.exports = { scrapeMangaSearch, scrapeChapterImages, scrapeMangaChapters };
