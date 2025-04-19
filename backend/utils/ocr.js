// utils/ocr.js
const Tesseract = require('tesseract.js');

const extractTextFromImage = async (imageUrl) => {
  try {
    const result = await Tesseract.recognize(imageUrl, 'eng', {
      logger: m => console.log(m)
    });
    return result.data.text;
  } catch (error) {
    console.error('Tesseract OCR error:', error);
    return '';
  }
};

module.exports = extractTextFromImage;
