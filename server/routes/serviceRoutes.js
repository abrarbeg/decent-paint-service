const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Service = require('../models/Service');

// 1. Create 'uploads' folder if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

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

        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

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
            const oldService = await Service.findById(req.params.id);
            if (oldService && oldService.imageUrl) {
                const oldFilename = oldService.imageUrl.split('/').pop();
                const oldPath = path.join(__dirname, '../uploads', oldFilename);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
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

        if (service.imageUrl) {
            const filename = service.imageUrl.split('/').pop();
            const filePath = path.join(__dirname, '../uploads', filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: "Service and image deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = router;