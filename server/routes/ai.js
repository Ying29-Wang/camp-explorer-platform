const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const auth = require('../middleware/auth');
const Camp = require('../models/camp');

// Get personalized camp recommendations
router.post('/recommendations', auth, async (req, res) => {
    try {
        const recommendations = await aiService.generateCampRecommendations({
            userId: req.user.id,
            ...req.body
        });
        res.json({ recommendations });
    } catch (error) {
        console.error('Error in recommendations route:', error);
        res.status(500).json({ error: error.message });
    }
});

// Analyze reviews for a specific camp
router.get('/analyze-reviews/:campId', async (req, res) => {
    try {
        const analysis = await aiService.analyzeReviews(req.params.campId);
        res.json({ analysis });
    } catch (error) {
        console.error('Error in analyze-reviews route:', error);
        res.status(500).json({ error: error.message });
    }
});

// Generate enhanced camp description
router.post('/generate-description', async (req, res) => {
    try {
        console.log('Received request to generate description:', req.body);
        
        // Validate required fields
        const { name, type, ageRange, location } = req.body;
        if (!name || !type || !ageRange || !location) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                message: 'Please provide name, type, ageRange, and location'
            });
        }

        const description = await aiService.generateCampDescription(req.body);
        res.json({ description });
    } catch (error) {
        console.error('Error in generate-description route:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate description'
        });
    }
});

module.exports = router; 