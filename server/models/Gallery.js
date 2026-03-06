const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  src: { type: String, required: true }, // URL or Base64 string
  category: { 
    type: String, 
    required: true, 
    enum: ["exterior", "interior", "textures"] 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Gallery", GallerySchema);