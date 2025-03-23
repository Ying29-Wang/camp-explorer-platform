const express = require('express');
const router = express.Router();
const Review = require('../models/review');

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
}); 

// @route   GET /api/reviews/camp/:campId
// @desc    Get all reviews for a specific camp
// @access  Public
router.get('/camp/:campId', async (req, res) => {
    try {
        const reviews = await Review.find({ campId: req.params.campId }).
        sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Public for now
router.post('/', async (req, res) => {
    try {
        const {
            userId,
            campId,
            rating,
            reviewText,
        } = req.body;

        const newReview = new Review({
            userId,
            campId,
            rating,
            reviewText
        });

        const review = await newReview.save();
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route  PUT /api/reviews/:id
// @desc   Update a review
// @access Public for now
router.put('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Public for now
router.delete('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.deleteOne();

        res.json({ message: 'Review deleted' });
    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;