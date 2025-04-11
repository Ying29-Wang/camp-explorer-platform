const express = require('express');
const router = express.Router();
const Bookmark = require('../models/bookmark');
const Camp = require('../models/camp');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Check if a camp is bookmarked
router.get('/:campId', auth, async (req, res) => {
    try {
        const { campId } = req.params;
        
        // Validate campId format
        if (!mongoose.Types.ObjectId.isValid(campId)) {
            return res.status(400).json({ error: 'Invalid camp ID format' });
        }

        // Check if camp exists
        const camp = await Camp.findById(campId);
        if (!camp) {
            return res.status(404).json({ error: 'Camp not found' });
        }

        // Get the correct user ID
        const userId = req.user._id || req.user.id;

        const bookmark = await Bookmark.findOne({
            userId: userId,
            campId: campId
        });

        res.json({ isBookmarked: !!bookmark });
    } catch (error) {
        console.error('Error checking bookmark:', error);
        res.status(500).json({ error: 'Failed to check bookmark status' });
    }
});

// Get user's bookmarks
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const bookmarks = await Bookmark.find({ userId: userId })
            .populate('campId')
            .sort({ createdAt: -1 });
        res.json(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});

// Add a new bookmark
router.post('/', auth, async (req, res) => {
    try {
        const { campId } = req.body;

        // Validate campId format
        if (!mongoose.Types.ObjectId.isValid(campId)) {
            return res.status(400).json({ error: 'Invalid camp ID format' });
        }

        // Check if camp exists
        const camp = await Camp.findById(campId);
        if (!camp) {
            return res.status(404).json({ error: 'Camp not found' });
        }

        // Get the correct user ID
        const userId = req.user._id || req.user.id;

        // Check if already bookmarked
        const existingBookmark = await Bookmark.findOne({
            userId: userId,
            campId: campId
        });

        if (existingBookmark) {
            return res.status(400).json({ error: 'Camp is already bookmarked' });
        }

        const bookmark = new Bookmark({
            userId: userId,
            campId: campId
        });

        await bookmark.save();
        res.status(201).json(bookmark);
    } catch (error) {
        console.error('Error adding bookmark:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack,
            validationErrors: error.errors
        });
        res.status(500).json({ 
            error: 'Failed to add bookmark',
            details: error.message,
            validationErrors: error.errors
        });
    }
});

// Remove a bookmark
router.delete('/:campId', auth, async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const bookmark = await Bookmark.findOneAndDelete({
            userId: userId,
            campId: req.params.campId
        });
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }
        res.json({ message: 'Bookmark removed successfully' });
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({ error: 'Failed to remove bookmark' });
    }
});

module.exports = router; 