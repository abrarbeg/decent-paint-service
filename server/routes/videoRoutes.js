const express = require("express");
const Video = require("../models/Video");

const router = express.Router();

// Add a new video
router.post("/add", async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category } = req.body;
    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
    });
    res.status(201).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add video" });
  }
});

// Get all videos (sorted newest first)
router.get("/all", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// Update a video by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category } = req.body;
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { title, description, videoUrl, thumbnailUrl, category },
      { new: true, runValidators: true }
    );
    if (!updatedVideo) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(updatedVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update video" });
  }
});

// Delete a video by ID
router.delete("/:id", async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete video" });
  }
});

module.exports = router;