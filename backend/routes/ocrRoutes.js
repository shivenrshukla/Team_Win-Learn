// routes/ocrRoutes.js
const express = require('express');
const router = express.Router();
const { extractTextFromImage } = require('../utils/ocr');
const { scrapeChapterImages } = require('../controllers/mangaController'); // reuse existing scraper

router.get('/ocr/:chapterSlug', async (req, res) => {
  const { chapterSlug } = req.params;
  try {
    const { images } = await scrapeChapterImages(chapterSlug);

    const ocrResults = await Promise.all(
      images.map(async (imgUrl, i) => ({
        page: i + 1,
        text: await extractTextFromImage(imgUrl)
      }))
    );

    res.json({ chapterSlug, ocrResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OCR failed', message: err.message });
  }
});

module.exports = router;
