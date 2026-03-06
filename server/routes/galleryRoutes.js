const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");

// Get all gallery images
router.get("/all", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new image
router.post("/add", async (req, res) => {
  try {
    const { src, category } = req.body;
    const newImage = new Gallery({ src, category });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete image
router.delete("/:id", async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;