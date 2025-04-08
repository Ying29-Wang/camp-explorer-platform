const express = require('express');
const router = express.Router();
const axios = require('axios');
const MAP_CONFIG = require('../config/maps');
const Camp = require('../models/camp');
const mongoose = require('mongoose');

// Error response helper
const errorResponse = (res, status, message, details = null) => {
    return res.status(status).json({
        success: false,
        error: {
            message,
            details: details || message
        }
    });
};

// Success response helper
const successResponse = (res, data, message = 'Success') => {
    return res.json({
        success: true,
        message,
        data
    });
};

// Input validation middleware
const validateCoordinates = (req, res, next) => {
    try {
        const { lat, lng } = req.query;
        
        if (!lat || !lng) {
            return errorResponse(res, 400, 
                'Missing required parameters',
                'Both latitude (lat) and longitude (lng) are required'
            );
        }

        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        if (isNaN(latNum) || isNaN(lngNum)) {
            return errorResponse(res, 400,
                'Invalid parameter type',
                'Latitude and longitude must be valid numbers'
            );
        }

        if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
            return errorResponse(res, 400,
                'Invalid coordinate range',
                'Latitude must be between -90 and 90, longitude between -180 and 180'
            );
        }

        req.validatedCoords = { lat: latNum, lng: lngNum };
        next();
    } catch (err) {
        console.error('Validation error:', err);
        return errorResponse(res, 500,
            'Validation error',
            'An error occurred while validating coordinates'
        );
    }
};

const validateRadius = (req, res, next) => {
    try {
        const { radius } = req.query;
        
        if (!radius) {
            req.query.radius = 50; // Default radius in kilometers
            return next();
        }

        const radiusNum = parseFloat(radius);
        
        if (isNaN(radiusNum)) {
            return errorResponse(res, 400,
                'Invalid parameter type',
                'Radius must be a valid number'
            );
        }

        if (radiusNum <= 0 || radiusNum > 1000) {
            return errorResponse(res, 400,
                'Invalid radius range',
                'Radius must be between 0 and 1000 kilometers'
            );
        }

        req.validatedRadius = radiusNum;
        next();
    } catch (err) {
        console.error('Validation error:', err);
        return errorResponse(res, 500,
            'Validation error',
            'An error occurred while validating radius'
        );
    }
};

// @route   GET /api/maps/geocode
// @desc    Geocode a location using OpenStreetMap Nominatim
// @access  Public
router.get('/geocode', async (req, res) => {
    try {
        const { location } = req.query;
        
        if (!location) {
            return errorResponse(res, 400,
                'Missing required parameter',
                'Location parameter is required for geocoding'
            );
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

        if (!response.data || response.data.length === 0) {
            return errorResponse(res, 404,
                'Location not found',
                'No results found for the provided location'
            );
        }

        const result = response.data[0];
        return successResponse(res, {
            formattedAddress: result.display_name,
            location: {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon)
            },
            placeId: result.place_id
        }, 'Location geocoded successfully');
    } catch (err) {
        console.error('Geocoding error:', err);
        
        if (err.response) {
            return errorResponse(res, err.response.status,
                'Geocoding service error',
                err.response.data?.error || 'Unknown error from geocoding service'
            );
        }
        
        return errorResponse(res, 500,
            'Internal server error',
            'An error occurred while processing your request'
        );
    }
});

// @route   GET /api/maps/camps/nearby
// @desc    Get camps within a radius of a location
// @access  Public
router.get('/camps/nearby', validateCoordinates, validateRadius, async (req, res) => {
    try {
        const { lat, lng } = req.validatedCoords;
        const radius = req.validatedRadius || 50;

        const point = {
            type: 'Point',
            coordinates: [lng, lat]
        };

        const camps = await Camp.find({
            coordinates: {
                $near: {
                    $geometry: point,
                    $maxDistance: radius * 1000 // Convert km to meters
                }
            }
        }).lean();

        if (!camps || camps.length === 0) {
            return errorResponse(res, 404,
                'No camps found',
                `No camps found within ${radius}km of the specified location`
            );
        }

        return successResponse(res, {
            count: camps.length,
            camps
        }, `${camps.length} camps found within ${radius}km`);
    } catch (err) {
        console.error('Error finding nearby camps:', err);
        
        if (err.name === 'CastError') {
            return errorResponse(res, 400,
                'Invalid data format',
                'One or more fields have invalid data types'
            );
        }
        
        return errorResponse(res, 500,
            'Internal server error',
            'An error occurred while searching for nearby camps'
        );
    }
});

// @route   GET /api/maps/camps
// @desc    Get all camps
// @access  Public
router.get('/camps', async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            return errorResponse(res, 503,
                'Service unavailable',
                'Database is not connected'
            );
        }

        const camps = await Camp.find({}).lean();

        // Return empty array if no camps found, but still return success
        return successResponse(res, {
            camps: camps || [],
            count: camps ? camps.length : 0
        }, 'Camps retrieved successfully');
    } catch (err) {
        console.error('Error fetching camps:', err);
        return errorResponse(res, 500,
            'Internal server error',
            'An error occurred while fetching camps'
        );
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