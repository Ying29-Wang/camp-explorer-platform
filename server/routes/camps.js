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
        const limit = req.query.limit ? parseInt(req.query.limit) : 0;
        const query = Camp.find().sort({ createdAt: -1 });
        
        // Apply limit if specified
        if (limit > 0) {
            query.limit(limit);
        }
        
        const camps = await query;
        res.json(camps);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/homepage', async (req, res) => {
    try {
        const featuredCamps = await Camp.find()
        .sort({ createdAt: -1 })
        .limit(3);

        const categoryCounts = await Camp.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({ featuredCamps, categoryCounts });
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