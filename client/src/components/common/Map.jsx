import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = ({ coordinates, title, description }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
            console.error('Invalid coordinates:', coordinates);
            return;
        }

        // Initialize map only once
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
                zoomControl: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                touchZoom: true,
                dragging: true
            }).setView(coordinates, 13);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
                minZoom: 3
            }).addTo(mapInstance.current);

            // Add marker
            const marker = L.marker(coordinates)
                .addTo(mapInstance.current);

            // Add popup if title or description exists
            if (title || description) {
                const popupContent = `
                    <div style="
                        background-color: #ffffff;
                        color: #000000;
                        padding: 10px;
                        border-radius: 4px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    ">
                        <h3 style="margin: 0 0 8px 0; color: #000000;">${title || 'Location'}</h3>
                        <p style="margin: 0; color: #000000;">${description || 'No description available'}</p>
                    </div>
                `;
                marker.bindPopup(popupContent).openPopup();
            }
        } else {
            // Update center if coordinates changed
            mapInstance.current.setView(coordinates, 13);
        }

        // Cleanup function
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [coordinates, title, description]);

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
            role="application"
            aria-label="Interactive map"
            aria-roledescription="Map showing camp location"
            tabIndex={0}
        />
    );
};

export default React.memo(Map);