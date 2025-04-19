const { 
  scrapeMangaSearch, 
  scrapeChapterImages, 
  scrapeMangaChapters,
  debugSearchManga
} = require('../utils/scraper');

const searchManga = async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(400).json({ error: 'Keyword is required' });

  try {
    const results = await scrapeMangaSearch(keyword);
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Scraping failed', message: err.message });
  }
};

const readChapter = async (req, res) => {
  const chapterSlug = req.params.chapterSlug;
  try {
    const images = await scrapeChapterImages(chapterSlug);
    res.json(images);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch chapter images', message: err.message });
  }
};

const getMangaDetails = async (req, res) => {
  const mangaId = req.params.mangaId;
  try {
    const mangaDetails = await scrapeMangaChapters(mangaId);
    res.json(mangaDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch manga details', message: err.message });
  }
};

const debugSearch = async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(400).json({ error: 'Keyword is required' });
  
  try {
    const debugInfo = await debugSearchManga(keyword);
    res.json(debugInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Debug failed', message: err.message });
  }
};

module.exports = { 
  searchManga, 
  readChapter, 
  getMangaDetails,
  debugSearch
};