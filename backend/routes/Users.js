// backend/routes/users.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ GET all users
router.get("/", async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// ✅ GET user by ID
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});



// ✅ POST create a user
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
    console.error("POST /users error:", err);
    res.status(500).json({ message: "Failed to add user" });
  }
});

// ✅ DELETE user by ID
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE /users error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
