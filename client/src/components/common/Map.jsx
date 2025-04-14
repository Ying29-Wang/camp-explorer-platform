import React, { useRef, useEffect, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = ({ center, markers = [], zoom = 13 }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);

    // Memoize the center and markers to prevent unnecessary updates
    const memoizedCenter = useMemo(() => center, [center[0], center[1]]);
    const memoizedMarkers = useMemo(() => markers, [JSON.stringify(markers)]);

    // Check if input is valid
    const isValidInput = memoizedCenter && Array.isArray(memoizedCenter) && memoizedCenter.length === 2;

    useEffect(() => {
        if (!isValidInput) {
            console.error('Invalid map input:', { center: memoizedCenter, markers: memoizedMarkers });
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
            }).setView(memoizedCenter, zoom);

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
        } else {
            // Update center if it changed
            mapInstance.current.setView(memoizedCenter, zoom);
        }

        // Remove only the markers that are no longer needed
        markersRef.current.forEach(marker => {
            if (!memoizedMarkers.some(m => m[0] === marker.getLatLng().lat && m[1] === marker.getLatLng().lng)) {
                mapInstance.current.removeLayer(marker);
            }
        });

        // Add new markers that don't exist yet
        memoizedMarkers.forEach(marker => {
            const markerExists = markersRef.current.some(m => 
                m.getLatLng().lat === marker[0] && m.getLatLng().lng === marker[1]
            );

            if (!markerExists) {
                const customIcon = L.icon({
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                    shadowSize: [41, 41]
                });

                const newMarker = L.marker(marker, { icon: customIcon })
                    .addTo(mapInstance.current)
                    .bindPopup('Camp Location')
                    .openPopup();

                markersRef.current.push(newMarker);
            }
        });

        // Update markersRef to only include current markers
        markersRef.current = markersRef.current.filter(marker => 
            memoizedMarkers.some(m => m[0] === marker.getLatLng().lat && m[1] === marker.getLatLng().lng)
        );

        // Cleanup function
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                markersRef.current = [];
            }
        };
    }, [memoizedCenter, zoom, memoizedMarkers, isValidInput]);

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

export default React.memo(Map);