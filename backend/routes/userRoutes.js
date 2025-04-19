const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Test route
router.get('/', (req, res) => {
  res.send('User Routes is running!');
});

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

module.exports = router;
