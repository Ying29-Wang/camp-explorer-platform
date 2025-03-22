const express = require('express');
const router = express.Router();
const Camp = require('../models/camp');
const Review = require('../models/review');
const { validateCamp, isLoggedIn, isAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');

// @route   GET /api/camps
// @desc    Get all camps
// @access  Public
router.get('/', async (req, res) => {
    try {
        const camps = await Camp.find().sort({ createdAt: -1 });
        res.json(camps);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   Get /api/camps/:id
// @desc    Get a camp by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id).populate('reviews');
        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }
        res.json(camp);
    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Camp not found' });
        }

        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/camps
// @desc    Create a new camp
// @access  Private