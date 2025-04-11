import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = ({ center, zoom = 13, markers = [] }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    // Validate coordinate format
    const isValidCoordinate = (coord) => {
        return Array.isArray(coord) && coord.length === 2 && 
               typeof coord[0] === 'number' && typeof coord[1] === 'number';
    };

    // Validate marker format
    const isValidMarker = (marker) => {
        return Array.isArray(marker) && marker.length === 2 && 
               typeof marker[0] === 'number' && typeof marker[1] === 'number';
    };

    // Check if all inputs are valid
    const isValidInput = center && isValidCoordinate(center) && 
                        markers.every(isValidMarker);

    useEffect(() => {
        if (!isValidInput) {
            console.error('Invalid map input:', { center, markers });
            return;
        }

        // Initialize map
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                zoomControl: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                touchZoom: true,
                dragging: true
            }).setView(center, zoom);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
                minZoom: 3
            }).addTo(mapInstance.current);

            // Add zoom control
            L.control.zoom({
                position: 'topright'
            }).addTo(mapInstance.current);
        }

        // Clear existing markers
        mapInstance.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapInstance.current.removeLayer(layer);
            }
        });

        // Add new markers
        markers.forEach(marker => {
            const customIcon = L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                shadowSize: [41, 41]
            });

            L.marker(marker, { icon: customIcon })
                .addTo(mapInstance.current)
                .bindPopup('Camp Location')
                .openPopup();
        });

        // Cleanup function
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [center, zoom, markers, isValidInput]);

    if (!isValidInput) {
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
                <p>Invalid map data</p>
            </div>
        );
    }

    return (
        <div 
            ref={mapRef}
            className="map-container" 
            style={{ 
                height: '300px', 
                margin: '1rem 0',
                borderRadius: '8px',
                overflow: 'hidden'
            }}
        />
    );
};

export default Map;