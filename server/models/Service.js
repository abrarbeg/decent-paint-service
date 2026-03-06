const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Interior', 'Exterior', 'Texture'], 
    required: true 
  },
  imageUrl: { type: String },
  price: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);