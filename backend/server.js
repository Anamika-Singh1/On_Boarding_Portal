const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://on-boarding-portal-aiensured.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.options("*", cors()); // ✅ Handle preflight requests

// ✅ Body parser
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/events");
const mentorRoutes = require("./routes/mentors");
const internRoutes = require("./routes/interns");
const userRoutes = require("./routes/users");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/interns", internRoutes);
app.use("/api/users", userRoutes);

// ✅ Root
app.get("/", (req, res) => {
  res.send("✅ Welcome to the AiEnsured Onboarding Portal Backend!");
});

// ✅ DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ DB connection error:", err));

// ✅ Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
