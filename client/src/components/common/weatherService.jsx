import React from 'react';

const WeatherWidget = ({ location }) => {
    return (
        <div className="weather-widget" style={{
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            margin: '1rem 0'
        }}>
            <h3>Weather Information</h3>
            <p>Location: {location}</p>
            {/* You can integrate a weather API here later */}
            <p>Weather data will be displayed here</p>
        </div>
    );
};

export default WeatherWidget;