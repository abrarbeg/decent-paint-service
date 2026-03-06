const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// ✅ POST: Save a new message (from Frontend Contact Form)
router.post('/add', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: "Booking saved successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET: Get all messages (for Admin Dashboard)
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }); // Showing newest first
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PATCH: Update 'read' status (FIXES the Admin "Mark as Read" button)
router.patch('/:id/read', async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { read: true }, // Explicitly set read to true
      { new: true }   // Return the updated document
    );
    
    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE: Remove a message (FIXES the Admin "Delete" button)
router.delete('/:id', async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;