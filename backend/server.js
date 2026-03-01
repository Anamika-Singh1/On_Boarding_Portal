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
  "https://on-boarding-portal-aiensured.vercel.app"
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

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Handle preflight requests correctly
app.options("*", cors(corsOptions));

/* =======================
   🔥 EXTRA SAFETY HEADERS
======================= */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* =======================
   BODY PARSER
======================= */
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