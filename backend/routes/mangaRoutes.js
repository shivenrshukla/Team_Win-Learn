const express = require('express');
const router = express.Router();
const { searchManga, readChapter, getMangaDetails } = require('../controllers/mangaController');

router.get('/search', searchManga);
router.get('/read/:chapterSlug', readChapter);
router.get('/:mangaId', getMangaDetails);

module.exports = router;