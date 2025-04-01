// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Remove extra /api
import { API_URL } from '../config/api'; // Ensure this is the correct path

export const fetchCamps = async () => {
    const response = await fetch(`${API_URL}/camps`); // Double /api here
    if (!response.ok) {
        throw new Error(`Failed to fetch camps: ${response.status} ${response.statusText}`);
    }
    
    // Handle potential HTML responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid content type. Received: ${contentType || 'none'}`);
    }

    return response.json();
};

export const fetchCampById = async (id) => {
    const response = await fetch(`${API_URL}/camps/${id}`); // Double /api here
    if (!response.ok) {
        throw new Error(`Failed to fetch camp: ${response.status} ${response.statusText}`);
    }
    
    // Same content-type check as above
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid content type. Received: ${contentType || 'none'}`);
    }

    return response.json();
};

// Fallback data
const fallbackCamps = [
    { _id: 1, name: "Adventure Camp", /*...*/ },
    // ... other fallback camps
];

export const fetchCampsWithFallback = async () => {
    try {
        return await fetchCamps();
    } catch (error) {
        console.error('Using fallback data:', error);
        return fallbackCamps;
    }
};