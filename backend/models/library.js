// models/Library.js
const mongoose = require('mongoose');

const LibrarySchema = new mongoose.Schema({
  userId: { type: String, required: true }, // in case multi-user
  mangaId: { type: String, required: true }, // MangaDex ID
  title: { type: String, required: true },
  cover: { type: String },
  description: { type: String },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Library', LibrarySchema);
