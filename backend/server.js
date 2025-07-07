const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Or specify your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/events');
const mentorRoutes = require('./routes/mentors');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/mentors', mentorRoutes);

// ✅ Default root route (important for Railway or Render)
app.get("/", (req, res) => {
  res.send("✅ Welcome to the AiEnsured Onboarding Portal Backend!");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ DB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
