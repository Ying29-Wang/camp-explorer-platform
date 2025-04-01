// Fallback data if database is not available
const SAMPLE_CAMPS = [
  {
    _id: 'sample1',
    name: 'Adventure Wilderness Camp',
    description: 'An outdoor adventure camp focused on survival skills, hiking, and nature exploration.',
    location: 'Boulder, Colorado',
    ageRange: {
      min: 8,
      max: 14
    },
    category: 'Adventure',
    activities: ['Hiking', 'Kayaking', 'Rock Climbing', 'Survival Skills'],
    price: 450,
    image: ['https://placehold.co/600x400?text=Adventure+Camp'],
    source: 'direct',
    website: 'https://example.com/adventure-camp',
    contact: 'John Doe',
    email: 'info@adventurecamp.com',
    phone: '303-555-1234',
    startDate: new Date('2023-06-15'),
    endDate: new Date('2023-06-30'),
    capacity: 60,
    registered: 45
  },
  {
    _id: 'sample2',
    name: 'Tech Innovation Camp',
    description: 'A coding and robotics camp where kids learn programming, robotics, and app development.',
    location: 'Austin, Texas',
    ageRange: {
      min: 10,
      max: 16
    },
    category: 'Technology',
    activities: ['Coding', 'Robotics', 'App Development', '3D Printing'],
    price: 550,
    image: ['https://placehold.co/600x400?text=Tech+Camp'],
    source: 'direct',
    website: 'https://example.com/tech-camp',
    contact: 'Jane Smith',
    email: 'info@techcamp.com',
    phone: '512-555-6789',
    startDate: new Date('2023-07-10'),
    endDate: new Date('2023-07-21'),
    capacity: 40,
    registered: 35
  },
  {
    _id: 'sample3',
    name: 'Creative Arts Camp',
    description: 'A camp focused on developing artistic abilities through painting, sculpture, and digital arts.',
    location: 'Portland, Oregon',
    ageRange: {
      min: 7,
      max: 15
    },
    category: 'Arts',
    activities: ['Painting', 'Sculpture', 'Photography', 'Digital Art'],
    price: 400,
    image: ['https://placehold.co/600x400?text=Arts+Camp'],
    source: 'direct',
    website: 'https://example.com/arts-camp',
    contact: 'Emma Wilson',
    email: 'info@artscamp.com',
    phone: '503-555-4321',
    startDate: new Date('2023-07-05'),
    endDate: new Date('2023-07-19'),
    capacity: 35,
    registered: 28
  }
];
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Camp = require('../models/camp');
const Review = require('../models/review');
// This middleware is imported but should not be applied to GET routes
const auth = require('../middleware/auth');

// @route   GET /api/camps
// @desc    Get all camps
// @access  Public
// No auth middleware for public routes
router.get('/', async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected, returning sample data');
            return res.json(SAMPLE_CAMPS);
        }

        const limit = req.query.limit ? parseInt(req.query.limit) : 0;
        const query = Camp.find().sort({ createdAt: -1 });
        
        // Apply limit if specified
        if (limit > 0) {
            query.limit(limit);
        }
        
        const camps = await query;
        
        // Return sample data if no camps found
        if (!camps || camps.length === 0) {
            console.log('No camps found in database, returning sample data');
            return res.json(SAMPLE_CAMPS);
        }
        
        res.json(camps);
    } catch (err) {
        console.error('Error fetching camps:', err.message);
        // Return sample data on error
        console.log('Error in camps route, returning sample data');
        res.json(SAMPLE_CAMPS);
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
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        // Check if user is a camp owner
        if(req.user.role !== 'campOwner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const newCamp = new Camp({
            ...req.body,
            createdBy: req.user.id // Associate the camp with the logged-in user
        });

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
router.put('/:id', auth, async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id);

        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }

        // Check if user is authorized to update the camp
        if (camp.createdBy && camp.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
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
router.delete('/:id', auth, async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id);

        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }

        // Check if user is authorized to delete the camp
        if (camp.createdBy && camp.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
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