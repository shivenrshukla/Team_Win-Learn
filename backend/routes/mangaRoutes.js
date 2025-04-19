const express = require('express');
const router = express.Router();
const { searchManga ,readChapter} = require('../controllers/mangaController');

router.get('/search', searchManga);
router.get('/read/:chapterSlug', readChapter);
router.get('/', (req, res) => {
    res.send('Manga Routes is running!');
  });
module.exports = router;
