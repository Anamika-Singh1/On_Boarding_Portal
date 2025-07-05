// ... your existing app.use routes

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/mentors', mentorRoutes);

// ✅ Default test route for root
app.get("/", (req, res) => {
  res.send("✅ Welcome to the AiEnsured Onboarding Portal Backend!");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ DB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
