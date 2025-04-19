const { searchMangaDex, getMangaDetailsFromDex, fetchChapterImagesFromMangaDex } = require('../utils/mangadex');
const extractTextFromImage = require('../utils/ocr');

const searchManga = async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(400).json({ error: 'Keyword is required' });

  try {
    const results = await searchMangaDex(keyword);
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Search failed', message: err.message });
  }
};

const readChapter = async (req, res) => {
  const chapterId = req.params.chapterId;
  const runOCR = req.query.ocr === 'true';

  try {
    const { chapterTitle, images } = await fetchChapterImagesFromMangaDex(chapterId);

    let ocrResults = [];

    if (runOCR) {
      ocrResults = await Promise.all(
        images.map(imageUrl => extractTextFromImage(imageUrl))
      );
    }

    res.json({
      chapterTitle,
      images,
      ocr: runOCR ? ocrResults : undefined,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch chapter images', message: err.message });
  }
};


const getMangaDetails = async (req, res) => {
  const mangaId = req.params.mangaId;
  try {
    const mangaDetails = await getMangaDetailsFromDex(mangaId);
    res.json(mangaDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch manga details', message: err.message });
  }
};


module.exports = { searchManga, readChapter, getMangaDetails };
