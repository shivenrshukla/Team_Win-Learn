const express = require('express');
const router = express.Router();
const Library = require('../models/library');
const { getGeminiRecommendations } = require('../utils/gemini');
const axios = require('axios');
const MANGADEX_BASE = 'https://api.mangadex.org';

// Add a manga to library
router.post('/add', async (req, res) => {
  const { userId, mangaId, title, cover, description } = req.body;
  try {
    const existing = await Library.findOne({ userId, mangaId });
    if (existing) return res.status(400).json({ error: 'Already saved' });

    const manga = await Library.create({ userId, mangaId, title, cover, description });
    res.json({ success: true, manga });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to library', message: err.message });
  }
});

// Fetch all saved mangas for a user
router.get('/:userId', async (req, res) => {
  try {
    const library = await Library.find({ userId: req.params.userId });
    res.json(library);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch library', message: err.message });
  }
});

// Get recommendations based on saved mangas
router.get('/:userId/recommendations', async (req, res) => {
  try {
    // Fetch the user's saved manga titles
    const saved = await Library.find({ userId: req.params.userId });

    if (saved.length === 0) {
      return res.status(400).json({ error: 'No manga in library to base recommendations on.' });
    }

    const titles = saved.map(m => m.title).filter(Boolean);

    const prompt = `According to these titles suggest me some more mangas that I would like. Give only the names and no other words: ${titles.join(', ')}`;

    const suggestionsText = await getGeminiRecommendations(prompt);
    
    // Parse the recommendations - split by lines or commas
    const recommendations = suggestionsText
      .split(/[\n,]+/)
      .map(title => title.trim())
      .filter(title => title && title.length > 0);

    res.json({
      usedTitles: titles,
      recommendedTitles: recommendations
    });
  } catch (err) {
    console.error('Error getting recommendations:', err);
    res.status(500).json({ error: 'Failed to get recommendations', message: err.message });
  }
});

// Get recommendations and search results
router.get('/:userId/recommend-and-search', async (req, res) => {
  try {
    // 1. Get user's library
    const saved = await Library.find({ userId: req.params.userId });
    
    if (saved.length === 0) {
      return res.status(400).json({ error: 'No manga in library to base recommendations on.' });
    }
    
    // 2. Extract titles
    const titles = saved.map(m => m.title).filter(Boolean);
    
    // 3. Send to Gemini for recommendations
    const prompt = `According to these titles suggest me 5 more mangas that I would like. Give only the names and no other words: ${titles.join(', ')}`;
    const suggestionsText = await getGeminiRecommendations(prompt);
    
    // 4. Parse the recommendations
    const recommendedTitles = suggestionsText
      .split(/[\n,]+/)
      .map(title => title.trim())
      .filter(title => title && title.length > 0 && title !== '.');
    
    // 5. Search for each recommended title
    const searchResults = [];
    
    for (const title of recommendedTitles) {
      try {
        console.log(`Searching for recommended manga: "${title}"`);
        const response = await axios.get(`${MANGADEX_BASE}/manga`, {
          params: {
            title,
            limit: 3, // Limit to top 3 matches per title
            includes: ['cover_art']
          }
        });
        
        if (response.data.data.length > 0) {
          const mappedResults = response.data.data.map(manga => {
            const cover = manga.relationships.find(rel => rel.type === 'cover_art');
            const coverUrl = cover
              ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}`
              : null;
            
            return {
              id: manga.id,
              title: manga.attributes.title.en || Object.values(manga.attributes.title)[0] || 'No title',
              description: manga.attributes.description?.en || 'No description',
              cover: coverUrl,
              recommendedAs: title // Track which recommendation this result came from
            };
          });
          
          searchResults.push(...mappedResults);
        }
      } catch (err) {
        console.error(`Failed to search for "${title}":`, err.message);
        // Continue with other titles even if one fails
      }
    }
    
    // 6. Return both recommendations and search results
    res.json({
      usedTitles: titles,
      recommendedTitles,
      searchResults
    });
    
  } catch (err) {
    console.error('Recommendation and search failed:', err);
    res.status(500).json({ 
      error: 'Failed to get recommendations and search', 
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
  }
});

module.exports = router;