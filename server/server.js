const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const videoRoutes = require("./routes/videoRoutes");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure Uploads Folder Exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve Uploads Folder Statically
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/videos', videoRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Decent Paint API is running');
});

// 🌟 GLOBAL ERROR HANDLER – MUST BE AFTER ALL ROUTES
app.use((err, req, res, next) => {
  console.error('🔥 Global error handler caught:', err);
  res.status(500).json({ 
    error: err.message || 'Internal server error',
    // Optionally include stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Decent Paint Database Connected"))
  .catch(err => console.log("❌ DB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});