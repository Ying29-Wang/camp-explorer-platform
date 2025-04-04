// OpenStreetMap configuration
const MAP_CONFIG = {
    // OpenStreetMap tile layer URL
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    
    // Default map settings
    defaultCenter: [0, 0],
    defaultZoom: 2,
    
    // Geocoding service (using Nominatim)
    geocoding: {
        baseUrl: 'https://nominatim.openstreetmap.org/search',
        format: 'json',
        limit: 1
    }
};

module.exports = MAP_CONFIG; 