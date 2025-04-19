const express = require('express');
const axios = require('axios');
const router = express.Router();

// Search for manga by title
router.get('/search/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const response = await axios.get(`https://api.mangadex.org/manga`, {
      params: {
        title,
        limit: 10,
        includes: ['cover_art']
      }
    });

    const results = response.data.data.map(manga => {
      const cover = manga.relationships.find(rel => rel.type === 'cover_art');
      const coverUrl = cover
        ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}`
        : null;

      return {
        id: manga.id,
        title: manga.attributes.title.en || 'No title',
        description: manga.attributes.description?.en || 'No description',
        cover: coverUrl
      };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// Get chapters for a specific manga ID
router.get('/:id/chapters', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://api.mangadex.org/chapter`, {
      params: {
        manga: id,
        translatedLanguage: ['en'],
        order: { chapter: 'asc' },
        limit: 100
      }
    });

    const chapters = response.data.data.map(ch => ({
      id: ch.id,
      chapter: ch.attributes.chapter,
      title: ch.attributes.title || `Chapter ${ch.attributes.chapter}`,
    }));

    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chapters', details: err.message });
  }
});

// Get images for a specific chapter
router.get('/read/:chapterId', async (req, res) => {
  const { chapterId } = req.params;

  try {
    const { data } = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
    const baseUrl = data.baseUrl;
    const chapter = data.chapter;

    const imageUrls = chapter.data.map(file => `${baseUrl}/data/${chapter.hash}/${file}`);

    res.json({ images: imageUrls });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load chapter images', details: err.message });
  }
});

module.exports = router;
