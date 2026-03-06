// updateImageUrls.js
require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');       // adjust path if needed
const Gallery = require('./models/Gallery');       // adjust path if needed
const Video = require('./models/Video');           // adjust path if needed

const LIVE_BACKEND_URL = 'https://decent-paint-backend.onrender.com'; // your actual backend URL
const OLD_URL = 'http://localhost:5000';

async function updateUrls() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Update Services
    const services = await Service.find({ imageUrl: { $regex: OLD_URL } });
    for (let service of services) {
      service.imageUrl = service.imageUrl.replace(OLD_URL, LIVE_BACKEND_URL);
      await service.save();
      console.log(`Updated service: ${service.title}`);
    }

    // Update Gallery
    const galleryItems = await Gallery.find({ src: { $regex: OLD_URL } });
    for (let item of galleryItems) {
      item.src = item.src.replace(OLD_URL, LIVE_BACKEND_URL);
      await item.save();
      console.log(`Updated gallery item: ${item._id}`);
    }

    // Update Videos (thumbnailUrl)
    const videos = await Video.find({ thumbnailUrl: { $regex: OLD_URL } });
    for (let video of videos) {
      video.thumbnailUrl = video.thumbnailUrl.replace(OLD_URL, LIVE_BACKEND_URL);
      await video.save();
      console.log(`Updated video: ${video.title}`);
    }

    console.log('✅ All URLs updated!');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

updateUrls();