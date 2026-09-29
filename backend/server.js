const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* =======================
   ✅ CORS CONFIG (FINAL)
======================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://on-boarding-portal-aiensured.vercel.app",
  "https://on-boarding-portal-dsaq.vercel.app",
  "https://on-boarding-portal-dsaq-d14l95n1k-anuritgithubs-projects.vercel.app",
  ...(process.env.ALLOWED_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean)
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// Application-level CORS also handles OPTIONS preflight requests.
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* =======================
   ROUTES
======================= */
const internRoutes = require('./routes/interns');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/events');
const mentorRoutes = require('./routes/mentors');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/interns', internRoutes);

/* =======================
   ROOT ROUTE
======================= */
app.get("/", (req, res) => {
  res.send("✅ Welcome to the AiEnsured Onboarding Portal Backend!");
});

/* =======================
   MONGODB CONNECTION
======================= */
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ DB connection error:', err));

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
