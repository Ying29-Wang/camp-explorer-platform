const express = require('express');
const router = express.Router();
const Camp = require('../models/camp');
const Review = require('../models/review');
// const { validateCamp, isLoggedIn, isAuthor } = require('../middleware');
// const ExpressError = require('../utils/ExpressError');

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
        const camp = await Camp.findById(req.params.id);
        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }

        // Get reviews for the camp
        const reviews = await Review.find({ campId: req.params.id })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });

        res.json({ camp, reviews });
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
// @access  Public for now
router.post('/', async (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Body received:', req.body);
    console.log('Body type:', typeof req.body);
    try {
        const newCamp = new Camp(req.body);
        const camp = await newCamp.save();
        res.json(camp);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/camps/:id
// @desc    Update a camp
// @access  Public for now
router.put('/:id', async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id);

        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }

        const updatedCamp = await Camp.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedCamp);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/camps/:id
// @desc    Delete a camp
// @access  Public for now
router.delete('/:id', async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id);

        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }

        await camp.deleteOne();

        res.json({ message: 'Camp deleted' });
    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Camp not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;