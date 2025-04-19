const express = require('express');
const router = express.Router();
const Reply = require('../models/Reply');

// Add a reply to a topic
router.post('/', async (req, res) => {
  const { topicId, body, userId } = req.body;
  try {
    const reply = new Reply({ topicId, body, userId });
    await reply.save();
    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all replies for a topic
router.get('/', async (req, res) => {
  const { topicId } = req.query;
  try {
    const replies = await Reply.find({ topicId }).sort({ createdAt: 1 });
    res.json(replies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
