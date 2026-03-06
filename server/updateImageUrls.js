// updateImageUrls.js
require('dotenv').config();
const mongoose = require('mongoose');

// Import your models
const Service = require('./models/Service');
const Gallery = require('./models/Gallery');
const Video = require('./models/Video');
// Add any other models that may store image URLs (e.g., a Project model)

// 🔴 REPLACE THIS WITH YOUR ACTUAL LIVE BACKEND URL
const LIVE_BACKEND_URL = 'https://decent-paint-backend.onrender.com'; // no trailing slash

// The old base URL(s) to replace – include both localhost variants you've used
const OLD_URLS = [
  'http://localhost:5000',
  'http://localhost:10000',
  'https://decent-paint-service.onrender.com', // if any still point to frontend
];

async function updateAllUrls() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Helper to update a field across all documents of a model
    async function updateField(Model, fieldName) {
      const docs = await Model.find({ [fieldName]: { $regex: /localhost|decent-paint-service/ } });
      let updatedCount = 0;
      for (let doc of docs) {
        let oldUrl = doc[fieldName];
        let newUrl = oldUrl;
        for (const oldBase of OLD_URLS) {
          if (newUrl.includes(oldBase)) {
            newUrl = newUrl.replace(oldBase, LIVE_BACKEND_URL);
          }
        }
        if (newUrl !== oldUrl) {
          doc[fieldName] = newUrl;
          await doc.save();
          updatedCount++;
          console.log(`✅ Updated ${Model.modelName} ${doc._id}: ${fieldName}`);
        }
      }
      console.log(`📊 ${Model.modelName}: ${updatedCount} documents updated.`);
    }

    // Update each model's relevant fields
    await updateField(Service, 'imageUrl');
    await updateField(Gallery, 'src');          // adjust field name if different (e.g., 'imageUrl')
    await updateField(Video, 'thumbnailUrl');

    // If your Gallery model uses a different field name (like 'image'), adjust above.

    console.log('🎉 All URL updates completed!');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

updateAllUrls();