const mongoose = require('mongoose');
const Service = require('./models/Service'); // Ensure path is correct
require('dotenv').config();

const services = [
  { 
    title: "Modern Hall", 
    description: "Premium interior finish with luxury emulsion.", 
    category: "Interior", 
    price: "₹25/sq ft", // ✅ Added price
    imageUrl: "/src/assets/interior/int1.jpg" 
  },
  { 
    title: "Classic Villa", 
    description: "Weather-proof exterior coating with 7-year warranty.", 
    category: "Exterior", 
    price: "₹35/sq ft", // ✅ Added price
    imageUrl: "/src/assets/exterior/ext1.jpg" 
  },
  { 
    title: "Royal Texture", 
    description: "Metallic 3D effects for premium feature walls.", 
    category: "Texture", 
    price: "Starts at ₹5,000", // ✅ Added price
    imageUrl: "/src/assets/textures/tex1.jpg" 
  },
  // Follow this pattern for your remaining 27 images...
];

const seedDB = async () => {
  try {
    console.log("⏳ Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("🧹 Clearing old services...");
    await Service.deleteMany({}); 
    
    console.log("🌱 Inserting new data with prices...");
    await Service.insertMany(services);
    
    console.log("✅ Gallery Data Seeded Successfully!");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

seedDB();