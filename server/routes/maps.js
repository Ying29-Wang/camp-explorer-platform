const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_ENDPOINTS } = require('../config/maps');
const Camp = require('../models/camp');

// @route   GET /api/maps/geocode
// @desc    Geocode a location
// @access  Public
router.get('/geocode', async (req, res) => {
    try {
        const { location } = req.query;
        
        if (!location) {
            return res.status(400).json({ message: 'Location is required' });
        }

        const response = await axios.get(GOOGLE_MAPS_ENDPOINTS.geocoding, {
            params: {
                address: location,
                key: GOOGLE_MAPS_API_KEY
            }
        });

        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const result = response.data.results[0];
            res.json({
                formattedAddress: result.formatted_address,
                location: result.geometry.location,
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
        const camps = await Camp.find({ 'coordinates.coordinates': { $exists: true } });
        res.json(camps);
    } catch (err) {
        console.error('Error fetching camps:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/maps/camps/:id
// @desc    Get camp details with coordinates
// @access  Public
router.get('/camps/:id', async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id);
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