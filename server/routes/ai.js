const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const auth = require('../middleware/auth');
const Camp = require('../models/camp');
const multer = require('multer');

// Configure multer for image upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

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

// Analyze camp image
router.post('/analyze-camp-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Convert the uploaded file to a data URL
        const imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        // Use the AI service to analyze the image
        const analysis = await aiService.analyzeCampImage(imageData);
        
        // Parse the analysis text into structured data
        const structuredAnalysis = parseAnalysis(analysis);
        
        res.json(structuredAnalysis);
    } catch (error) {
        console.error('Error analyzing camp image:', error);
        res.status(500).json({ message: 'Failed to analyze image', error: error.message });
    }
});

// Helper function to parse the AI analysis into structured data
function parseAnalysis(analysis) {
    // Extract age range
    const ageMatch = analysis.match(/age group.*?(\d+).*?(\d+)/i);
    const ageRange = ageMatch ? {
        min: parseInt(ageMatch[1]),
        max: parseInt(ageMatch[2])
    } : null;

    // Extract category
    const categoryMatch = analysis.match(/type of camp.*?([A-Za-z]+)/i);
    const category = categoryMatch ? categoryMatch[1] : null;

    // Extract activities
    const activitiesMatch = analysis.match(/activities.*?([^.]+)/i);
    const activities = activitiesMatch ? 
        activitiesMatch[1].split(',').map(a => a.trim()) : 
        [];

    // Extract description
    const description = analysis;

    return {
        ageRange,
        category,
        activities,
        description
    };
}

module.exports = router; 