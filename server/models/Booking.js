const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  service: { 
    type: String, 
    required: true 
  }, // e.g., "Interior Painting"
  message: { 
    type: String 
  },
  // ✅ Added read status to support Admin panel filtering
  read: { 
    type: Boolean, 
    default: false 
  },
  // ✅ Standardized date field to support sorting
  date: { 
    type: Date, 
    default: Date.now 
  }
}, {
  // ✅ Automatically manages createdAt and updatedAt fields
  timestamps: true 
});

module.exports = mongoose.model('Booking', BookingSchema);