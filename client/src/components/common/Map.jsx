import React from 'react';

const Map = ({ location }) => {
    // For now, return a simple placeholder
    return (
        <div className="map-container" style={{ 
            height: '300px', 
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '1rem 0',
            borderRadius: '8px'
        }}>
            <p>Map View for: {location}</p>
            {/* You can integrate Google Maps or other map services here later */}
        </div>
    );
};

export default Map;