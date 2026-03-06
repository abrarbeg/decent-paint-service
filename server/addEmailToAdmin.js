// addEmailToAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin'); // adjust path if needed

async function addEmailToAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const admin = await Admin.findOne({ username: 'admin' });
    if (!admin) {
      console.log('❌ Admin not found');
      process.exit();
    }

    // Set the desired email (replace with your client's email)
    admin.email = 'begabrar250@gmail.com'; // or your client's email
    await admin.save();

    console.log('✅ Email added to admin:', admin.email);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

addEmailToAdmin();