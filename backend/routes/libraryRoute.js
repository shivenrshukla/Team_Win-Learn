const express = require('express');
const router = express.Router();
const Library = require('../models/library');
const { getGeminiRecommendations } = require('../utils/gemini');

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
  
      const prompt = `
  I have a personal manga library containing the following titles: ${titles.join(', ')}.
  Based on my collection, recommend 5 other manga titles I might enjoy.
  Consider genre, themes, and art style. Please return only the manga titles, optionally with 1-line descriptions.
      `.trim();
  
      const suggestions = await getGeminiRecommendations(prompt);
  
      res.json({
        usedTitles: titles,
        prompt,
        recommendations: suggestions
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get recommendations', message: err.message });
    }
  });
  

module.exports = router;
