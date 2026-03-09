const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ======================
// ✅ GET all users (most recent first)
// ======================
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("❌ GET /users error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// ✅ GET a single user by ID
// ======================
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ GET /users/:id error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// ✅ POST: Create a new user
// ======================
router.post("/", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, role });
    res.status(201).json(user);
  } catch (err) {
    console.error("❌ POST /users error:", err.message);
    res.status(500).json({ message: "Failed to add user" });
  }
});

// ======================
// ✅ DELETE: Remove a user by ID
// ======================
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE /users/:id error:", err.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;