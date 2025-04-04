const express = require('express');
const router = express.Router();
const axios = require('axios');
const MAP_CONFIG = require('../config/maps');
const Camp = require('../models/camp');
const mongoose = require('mongoose');

// Sample data for fallback
const SAMPLE_CAMPS = [
  {
    _id: 'sample1',
    name: 'Adventure Wilderness Camp',
    description: 'An outdoor adventure camp focused on survival skills, hiking, and nature exploration.',
    location: 'Boulder, Colorado',
    coordinates: {
      type: 'Point',
      coordinates: [-105.2705, 40.0150]
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
      coordinates: [-97.7437, 30.2711]
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
      coordinates: [-122.6765, 45.5155]
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

// @route   GET /api/maps/geocode
// @desc    Geocode a location using OpenStreetMap Nominatim
// @access  Public
router.get('/geocode', async (req, res) => {
    try {
        const { location } = req.query;
        
        if (!location) {
            return res.status(400).json({ message: 'Location is required' });
        }

        const response = await axios.get(MAP_CONFIG.geocoding.baseUrl, {
            params: {
                q: location,
                format: MAP_CONFIG.geocoding.format,
                limit: MAP_CONFIG.geocoding.limit
            },
            headers: {
                'User-Agent': 'CampExplorer/1.0'
            }
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            res.json({
                formattedAddress: result.display_name,
                location: {
                    lat: parseFloat(result.lat),
                    lng: parseFloat(result.lon)
                },
                placeId: result.place_id
            });
        } else {
            res.status(404).json({ message: 'Location not found' });
        }
    } catch (err) {
        console.error('Geocoding error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/maps/camps
// @desc    Get all camps with coordinates
// @access  Public
router.get('/camps', async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(200).json(SAMPLE_CAMPS);
        }

        // Find all camps
        const camps = await Camp.find({}).lean();

        // If no camps found, return sample data
        if (!camps || camps.length === 0) {
            return res.status(200).json(SAMPLE_CAMPS);
        }
        
        res.status(200).json(camps);
    } catch (err) {
        console.error('Error fetching camps:', err);
        res.status(200).json(SAMPLE_CAMPS);
    }
});

// @route   GET /api/maps/camps/nearby
// @desc    Get camps within a radius of a location
// @access  Public
router.get('/camps/nearby', async (req, res) => {
    try {
        const { lat, lng, radius = 50 } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const point = {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
        };

        const camps = await Camp.find({
            coordinates: {
                $near: {
                    $geometry: point,
                    $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
                }
            }
        }).lean();

        res.json(camps);
    } catch (err) {
        console.error('Error finding nearby camps:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/maps/camps/:id
// @desc    Get a specific camp by ID
// @access  Public
router.get('/camps/:id', async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id).lean();
        
        if (!camp) {
            return res.status(404).json({ message: 'Camp not found' });
        }
        
        res.json(camp);
    } catch (err) {
        console.error('Error fetching camp:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router; 