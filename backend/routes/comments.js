const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// POST: Add comment
router.post('/', async (req, res) => {
  const { userId, chapterId, text } = req.body;
  try {
    const comment = new Comment({ userId, chapterId, text });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get comments by chapter
router.get('/', async (req, res) => {
  const { chapterId } = req.query;
  try {
    const comments = await Comment.find({ chapterId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a comment
router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
