// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('🔧 Initializing Cloudinary...');
console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API_KEY exists?', !!process.env.CLOUDINARY_API_KEY);
console.log('API_SECRET exists?', !!process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'decent-paint',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
});

console.log('✅ Cloudinary configured successfully');

module.exports = { cloudinary, storage };