// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/events');
const mentorRoutes = require('./routes/mentors');  // ✅ NEW line

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/mentors', mentorRoutes); // ✅ Register mentor routes

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ DB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
