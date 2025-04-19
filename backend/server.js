const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const ocrRoutes = require('./routes/ocrRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/topics', require('./routes/topics'));
app.use('/api/replies', require('./routes/replies'));
app.use('/api/manga', require('./routes/mangaRoutes'));
app.use('/api/users',require('./routes/userRoutes'))
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});