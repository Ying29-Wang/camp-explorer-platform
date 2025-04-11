import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchCamps } from '../../../services/campService';
import './Map.css';

const Map = () => {
  const [camps, setCamps] = useState([]);
  const [center, setCenter] = useState([47.6062, -122.3321]); // Default Seattle location
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location, showing default location');
        }
      );
    }

    // Fetch camp data
    const loadCamps = async () => {
      try {
        const data = await fetchCamps();
        setCamps(data);
      } catch (err) {
        console.error('Error loading camps:', err);
        setError('Unable to load camp data');
      }
    };

    loadCamps();
  }, []);

  return (
    <div className="map-container">
      {error && <div className="error-message">{error}</div>}
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {camps.map((camp) => (
          camp.coordinates && (
            <Marker
              key={camp._id}
              position={[
                camp.coordinates.coordinates[1],
                camp.coordinates.coordinates[0]
              ]}
            >
              <Popup>
                <div>
                  <h3>{camp.name}</h3>
                  <p>{camp.location}</p>
                  <p>Age Range: {camp.ageRange.min}-{camp.ageRange.max} years</p>
                  <p>Price: ${camp.price}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default Map; 