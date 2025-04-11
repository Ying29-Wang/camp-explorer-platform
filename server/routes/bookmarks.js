const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const auth = require('../middleware/auth');

// Get user's bookmarks
router.get('/', auth, async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ userId: req.user._id })
            .populate('campId')
            .sort({ createdAt: -1 });
        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a bookmark
router.post('/', auth, async (req, res) => {
    try {
        const bookmark = new Bookmark({
            userId: req.user._id,
            campId: req.body.campId
        });
        const savedBookmark = await bookmark.save();
        res.status(201).json(savedBookmark);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Camp is already bookmarked' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// Remove a bookmark
router.delete('/:campId', auth, async (req, res) => {
    try {
        const bookmark = await Bookmark.findOneAndDelete({
            userId: req.user._id,
            campId: req.params.campId
        });
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }
        res.json({ message: 'Bookmark removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 