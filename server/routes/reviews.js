const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const auth = require('../middleware/auth');

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

// @route   GET /api/reviews/user
// @desc    Get all reviews for the current user
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate('campId', 'name');
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
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const newReview = new Review({
            userId: req.user.id, // Use the authenticated user's ID
            campId: req.body.campId,
            rating: req.body.rating,
            reviewText: req.body.reviewText
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
// @access Private
router.put('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is the owner of the review
        if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedReview);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is the owner of the review
        if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
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