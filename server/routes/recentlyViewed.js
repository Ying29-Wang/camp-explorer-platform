const express = require('express');
const router = express.Router();
const RecentlyViewed = require('../models/RecentlyViewed');
const auth = require('../middleware/auth');

// Track a camp view
router.post('/', auth, async (req, res) => {
    try {
        const recentlyViewed = new RecentlyViewed({
            userId: req.user._id,
            campId: req.body.campId
        });
        await recentlyViewed.save();
        res.status(201).json(recentlyViewed);
    } catch (error) {
        if (error.code === 11000) {
            // If the camp is already in recently viewed, update the viewedAt timestamp
            const updated = await RecentlyViewed.findOneAndUpdate(
                { userId: req.user._id, campId: req.body.campId },
                { viewedAt: new Date() },
                { new: true }
            );
            res.json(updated);
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// Get user's recently viewed camps
router.get('/', auth, async (req, res) => {
    try {
        const recentlyViewed = await RecentlyViewed.find({ userId: req.user._id })
            .populate('campId')
            .sort({ viewedAt: -1 })
            .limit(10);
        res.json(recentlyViewed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 