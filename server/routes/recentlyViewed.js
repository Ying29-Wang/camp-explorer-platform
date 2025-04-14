const express = require('express');
const router = express.Router();
const RecentlyViewed = require('../models/recentlyViewed');
const Camp = require('../models/camp');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Track a camp view
router.post('/', auth, async (req, res) => {
    try {
        console.log('Received request to track view:', {
            user: req.user,
            body: req.body,
            userId: req.user._id || req.user.id
        });

        const { campId } = req.body;
        
        if (!campId) {
            console.error('No campId provided in request');
            return res.status(400).json({ error: 'Camp ID is required' });
        }

        // Validate campId format
        if (!mongoose.Types.ObjectId.isValid(campId)) {
            console.error('Invalid campId format:', campId);
            return res.status(400).json({ error: 'Invalid Camp ID format' });
        }

        // Check if the camp exists
        const campExists = await Camp.findById(campId);
        if (!campExists) {
            console.error('Camp not found:', campId);
            return res.status(404).json({ error: 'Camp not found' });
        }

        // Get the correct user ID
        const userId = req.user._id || req.user.id;

        // Check if the view already exists
        const existingView = await RecentlyViewed.findOne({
            userId: userId,
            campId: campId
        });

        if (existingView) {
            console.log('Found existing view, updating timestamp');
            // Update the existing view
            existingView.viewedAt = new Date();
            await existingView.save();
            return res.json(existingView);
        }

        console.log('Creating new view record with:', {
            userId: userId,
            campId: campId
        });

        // Create new view
        const recentlyViewed = new RecentlyViewed({
            userId: userId,
            campId: campId
        });
        
        await recentlyViewed.save();
        console.log('Successfully created new view record:', recentlyViewed);
        res.status(201).json(recentlyViewed);
    } catch (error) {
        console.error('Error in track view:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack,
            validationErrors: error.errors
        });
        res.status(500).json({ 
            error: 'Failed to track view',
            details: error.message,
            validationErrors: error.errors
        });
    }
});

// Get user's recently viewed camps
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        console.log('Fetching recently viewed for user:', userId);
        const recentlyViewed = await RecentlyViewed.find({ userId: userId })
            .populate({
                path: 'campId',
                select: 'name location image description'
            })
            .sort({ viewedAt: -1 })
            .limit(10);
            
        console.log('Found recently viewed camps:', recentlyViewed.length);
        res.json(recentlyViewed);
    } catch (error) {
        console.error('Error fetching recently viewed:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        res.status(500).json({ 
            error: 'Failed to fetch recently viewed camps',
            details: error.message 
        });
    }
});

module.exports = router; 