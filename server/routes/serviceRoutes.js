const express = require('express');
const router = express.Router();
const multer = require('multer');
const Service = require('../models/Service');
const { storage } = require('../config/cloudinary'); // Cloudinary storage
const upload = multer({ storage }); // Use Cloudinary storage

// GET: Fetch all services
router.get('/all', async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch services" });
    }
});

// POST: Add new service
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, price } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: "Please upload an image" });
        }

        // Cloudinary returns the secure URL in req.file.path
        const imageUrl = req.file.path;

        const newService = new Service({
            title,
            description,
            category,
            price,
            imageUrl
        });

        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (err) {
        res.status(400).json({ error: "Error creating service: " + err.message });
    }
});

// PUT: Update service
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, price } = req.body;
        let updateData = { title, description, category, price };

        if (req.file) {
            // If you want to delete the old image from Cloudinary, you can add logic here
            updateData.imageUrl = req.file.path;
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updatedService);
    } catch (err) {
        res.status(400).json({ error: "Update failed: " + err.message });
    }
});

// DELETE: Remove service
router.delete('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ error: "Service not found" });

        // Optionally delete image from Cloudinary (uncomment if you want to clean up)
        // const publicId = service.imageUrl.split('/').pop().split('.')[0];
        // await cloudinary.uploader.destroy(`decent-paint/${publicId}`);

        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = router;