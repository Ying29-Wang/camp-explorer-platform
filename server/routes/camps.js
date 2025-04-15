// Fallback data if database is not available
const SAMPLE_CAMPS = [
  {
    _id: 'sample1',
    name: 'Adventure Wilderness Camp',
    description: 'An outdoor adventure camp focused on survival skills, hiking, and nature exploration.',
    location: 'Boulder, Colorado',
    coordinates: {
      type: 'Point',
      coordinates: [-105.2705, 40.0150] // Boulder, CO coordinates
    },
    formattedAddress: 'Boulder, Boulder County, Colorado, United States',
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
    coordinates: {
      type: 'Point',
      coordinates: [-97.7437, 30.2711] // Austin, TX coordinates
    },
    formattedAddress: 'Austin, Travis County, Texas, United States',
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
    coordinates: {
      type: 'Point',
      coordinates: [-122.6765, 45.5155] // Portland, OR coordinates
    },
    formattedAddress: 'Portland, Multnomah County, Oregon, United States',
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
const { validateCamp } = require('../middleware/validation');

// @route   GET/POST /api/camps/search
// @desc    Search camps with multiple criteria
// @access  Public
async function handleSearch(req, res) {
    try {
        // Get search parameters from either query or body
        const params = req.method === 'GET' ? req.query : req.body;
        
        // Build query
        const query = {};
        
        // Text search
        if (params.searchText) {
            query.$text = { $search: params.searchText };
        }
        
        // Category filter
        if (params.category) {
            query.category = params.category;
        }
        
        // Location filter
        if (params.location) {
            query.location = { $regex: params.location, $options: 'i' };
        }
        
        // Age range filter
        if (params.minAge || params.maxAge) {
            query['ageRange.min'] = { $gte: parseInt(params.minAge) || 0 };
            query['ageRange.max'] = { $lte: parseInt(params.maxAge) || 100 };
        }
        
        // Price range filter
        if (params.minPrice || params.maxPrice) {
            query.price = {};
            if (params.minPrice) query.price.$gte = parseFloat(params.minPrice);
            if (params.maxPrice) query.price.$lte = parseFloat(params.maxPrice);
        }
        
        // Date range filter
        if (params.startDate || params.endDate) {
            query.startDate = {};
            if (params.startDate) query.startDate.$gte = new Date(params.startDate);
            if (params.endDate) query.startDate.$lte = new Date(params.endDate);
        }
        
        // Activities filter
        if (params.activities) {
            const activities = Array.isArray(params.activities) 
                ? params.activities 
                : params.activities.split(',');
            query.activities = { $in: activities };
        }

        // Status filter
        if (params.status) {
            query.status = params.status;
        } else {
            // Default to active camps if no status specified
            query.status = 'active';
        }
        
        // Build sort options
        const sortOptions = {};
        if (params.sortBy) {
            sortOptions[params.sortBy] = params.sortOrder === 'desc' ? -1 : 1;
        }
        
        // Build pagination options
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Execute query with text search score if text search is used
        const findOptions = params.searchText ? { score: { $meta: 'textScore' } } : {};
        const camps = await Camp.find(query, findOptions)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
            
        // Get total count for pagination
        const total = await Camp.countDocuments(query);
        
        res.json({
            success: true,
            camps,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ 
            success: false,
            message: 'Server Error',
            error: err.message 
        });
    }
}

// Define search routes
router.get('/search', handleSearch);
router.post('/search', handleSearch);

// @route   GET /api/camps
// @desc    Get all camps
// @access  Public
router.get('/', async (req, res) => {
    try {
        const camps = await Camp.find().nonDeleted();
        res.json(camps);
    } catch (error) {
        console.error('Error fetching camps:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/camps/status/:status
// @desc    Get camps by status
// @access  Public
router.get('/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const camps = await Camp.find({ status })
            .sort({ viewCount: -1, createdAt: -1 });
        res.json(camps);
    } catch (err) {
        console.error('Error fetching camps by status:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/camps/homepage
// @desc    Get camps for homepage
// @access  Public
router.get('/homepage', async (req, res) => {
    try {
        const featuredCamps = await Camp.find({ status: 'active' })
            .sort({ viewCount: -1, createdAt: -1 })
            .limit(3);

        const categoryCounts = await Camp.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({ featuredCamps, categoryCounts });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Test endpoint to check database connection
router.get('/test', async (req, res) => {
    try {
        console.log('Testing database connection...');
        const count = await Camp.countDocuments();
        console.log('Number of camps in database:', count);
        res.json({ message: 'Database connection successful', campCount: count });
    } catch (err) {
        console.error('Database test error:', err);
        res.status(500).json({ message: 'Database connection failed', error: err.message });
    }
});

// @route   GET /api/camps/owner
// @desc    Get all camps owned by the current user
// @access  Private
router.get('/owner', auth, async (req, res) => {
    try {
        const camps = await Camp.find({ owner: req.user.id }).nonDeleted();
        res.json(camps);
    } catch (err) {
        console.error('Error in /api/camps/owner:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/camps/:id
// @desc    Get a camp by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id).nonDeleted();
        
        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }
        
        res.json(camp);
    } catch (error) {
        console.error('Error fetching camp:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/camps
// @desc    Create a new camp
// @access  Private
router.post('/', auth, validateCamp, async (req, res) => {
    try {
        console.log('Received camp creation request:', req.body);
        
        // Validate required fields
        const requiredFields = ['name', 'location'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.log('Missing required fields:', missingFields);
            return res.status(400).json({ 
                message: 'Missing required fields', 
                missingFields 
            });
        }

        const newCamp = new Camp({
            ...req.body,
            owner: req.user.id,
            status: 'active',
            viewCount: 0,
            latitude: req.body.latitude || 0,
            longitude: req.body.longitude || 0
        });

        console.log('Creating new camp:', newCamp);
        const camp = await newCamp.save();
        res.json(camp);
    } catch (err) {
        console.error('Error creating camp:', err);
        res.status(500).json({ 
            message: 'Server Error',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// @route   PUT /api/camps/:id
// @desc    Update a camp
// @access  Private
router.put('/:id', auth, validateCamp, async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id);

        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }

        // Check if the user is the owner of the camp or admin
        if (camp.owner && camp.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Don't allow updating viewCount through this route
        if (req.body.viewCount) {
            delete req.body.viewCount;
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
// @access  Private/Camp Owner or Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id);
        
        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }

        // Check if user is camp owner or admin
        if (camp.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this camp' });
        }

        // Perform soft delete
        await Camp.findByIdAndUpdate(req.params.id, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: req.user.id
            }
        });
        
        res.json({ message: 'Camp deleted successfully' });
    } catch (error) {
        console.error('Error deleting camp:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/camps/:id/status
// @desc    Update camp status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const camp = await Camp.findById(req.params.id);
        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }

        // Check if the user is the owner of the camp or admin
        if (camp.owner && camp.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedCamp = await Camp.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { new: true }
        );
        res.json(updatedCamp);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;