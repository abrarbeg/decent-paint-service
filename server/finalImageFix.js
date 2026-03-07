// finalImageFix.js
require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Gallery = require('./models/Gallery');
const Video = require('./models/Video');

const LIVE_URL = 'https://decent-paint-service.onrender.com'; // your actual backend
const OLD_PATTERNS = [
  'http://localhost:5000',
  'http://localhost:10000',
  'https://decent-paint-service-1.onrender.com' // if any point to frontend
];

async function fixAll() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to DB');

  // Update Services
  const services = await Service.find({ imageUrl: { $regex: /localhost|decent-paint-service-1/ } });
  for (let s of services) {
    let newUrl = s.imageUrl;
    for (let p of OLD_PATTERNS) {
      if (newUrl.includes(p)) newUrl = newUrl.replace(p, LIVE_URL);
    }
    if (newUrl !== s.imageUrl) {
      s.imageUrl = newUrl;
      await s.save();
      console.log(`Updated service: ${s.title}`);
    }
  }

  // Update Gallery (adjust field name if needed)
  const gallery = await Gallery.find({ src: { $regex: /localhost|decent-paint-service-1/ } });
  for (let g of gallery) {
    let newUrl = g.src;
    for (let p of OLD_PATTERNS) {
      if (newUrl.includes(p)) newUrl = newUrl.replace(p, LIVE_URL);
    }
    if (newUrl !== g.src) {
      g.src = newUrl;
      await g.save();
      console.log(`Updated gallery item: ${g._id}`);
    }
  }

  // Update Videos
  const videos = await Video.find({ thumbnailUrl: { $regex: /localhost|decent-paint-service-1/ } });
  for (let v of videos) {
    let newUrl = v.thumbnailUrl;
    for (let p of OLD_PATTERNS) {
      if (newUrl.includes(p)) newUrl = newUrl.replace(p, LIVE_URL);
    }
    if (newUrl !== v.thumbnailUrl) {
      v.thumbnailUrl = newUrl;
      await v.save();
      console.log(`Updated video: ${v.title}`);
    }
  }

  console.log('✅ All done!');
  process.exit();
}

fixAll().catch(err => {
  console.error(err);
  process.exit(1);
});