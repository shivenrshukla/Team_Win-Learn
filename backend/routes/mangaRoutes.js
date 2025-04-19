const express = require('express');
const axios = require('axios');
const router = express.Router();
const { normalizeTitle } = require('../utils/gemini');

const MANGADEX_BASE = 'https://api.mangadex.org';

// SEARCH: first normalize via Gemini, then hit MangaDex
router.get('/search/:rawQuery', async (req, res) => {
  try {
    // 1) Normalize / extract title via Gemini
    const raw = req.params.rawQuery;
    const title = await normalizeTitle(raw);

    // 2) Now search MangaDex
    const mdRes = await axios.get(`${MANGADEX_BASE}/manga`, {
      params: { title, limit: 10, includes: ['cover_art'] }
    });

    // 3) Map results
    const results = mdRes.data.data.map(manga => {
      const cover = manga.relationships.find(r => r.type === 'cover_art');
      return {
        id: manga.id,
        title: manga.attributes.title.en || 'No title',
        description: manga.attributes.description?.en || 'No description',
        cover: cover
          ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}`
          : null
      };
    });

    res.json({ rawQuery: raw, usedTitle: title, results });
  } catch (err) {
    console.error('Search+Gemini failed:', err);
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// … keep your chapters & read routes unchanged …

module.exports = router;
