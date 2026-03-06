const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB for seeding...");

    // Clear existing admins to avoid duplicates (optional – you can remove this if you want to keep existing)
    await Admin.deleteMany({});
    console.log("🗑️ Cleared existing admins");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('paint123', salt);

    // Create the admin user with email
    const newAdmin = new Admin({
      username: 'admin',
      email: 'admin@decentpaint.com', // Set a real email or placeholder
      password: hashedPassword
    });

    await newAdmin.save();
    console.log("✅ Admin user created successfully!");
    console.log("   Username: admin");
    console.log("   Password: paint123");
    console.log("   Email: begabrar250@gmail.com");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedAdmin();