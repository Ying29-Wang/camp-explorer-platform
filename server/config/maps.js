// Google Maps API configuration
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Google Maps API endpoints
const GOOGLE_MAPS_ENDPOINTS = {
    geocoding: 'https://maps.googleapis.com/maps/api/geocode/json',
    places: 'https://maps.googleapis.com/maps/api/place',
    directions: 'https://maps.googleapis.com/maps/api/directions/json'
};

module.exports = {
    GOOGLE_MAPS_API_KEY,
    GOOGLE_MAPS_ENDPOINTS
}; 