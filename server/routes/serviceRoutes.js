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
        console.error('❌ Error fetching services:', err);
        res.status(500).json({ error: "Failed to fetch services" });
    }
});

// POST: Add new service
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        console.log('📦 req.file:', req.file);
        console.log('📦 req.body:', req.body);

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
        console.log('✅ Service saved:', savedService.title);
        res.status(201).json(savedService);
    } catch (err) {
        console.error('🔥 Error creating service:', err);
        res.status(500).json({ error: "Error creating service: " + err.message });
    }
});

// PUT: Update service
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        console.log('📦 Update - req.file:', req.file);
        console.log('📦 Update - req.body:', req.body);

        const { title, description, category, price } = req.body;
        let updateData = { title, description, category, price };

        if (req.file) {
            // Optionally delete old image from Cloudinary here (advanced)
            updateData.imageUrl = req.file.path;
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        console.log('✅ Service updated:', updatedService.title);
        res.json(updatedService);
    } catch (err) {
        console.error('🔥 Update failed:', err);
        res.status(500).json({ error: "Update failed: " + err.message });
    }
});

// DELETE: Remove service
router.delete('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ error: "Service not found" });

        // Optional: Delete image from Cloudinary (requires cloudinary import)
        // const publicId = service.imageUrl.split('/').pop().split('.')[0];
        // await cloudinary.uploader.destroy(`decent-paint/${publicId}`);

        await Service.findByIdAndDelete(req.params.id);
        console.log('✅ Service deleted:', service.title);
        res.json({ message: "Service deleted successfully" });
    } catch (err) {
        console.error('🔥 Delete failed:', err);
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = router;